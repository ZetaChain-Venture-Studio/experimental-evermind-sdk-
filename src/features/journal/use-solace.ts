"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useChat, useMemory, useEncryption } from "@reverbia/sdk/react";
import { usePrivy } from "@privy-io/react-auth";

export type MoodType = "joy" | "calm" | "sad" | "anxious" | "angry" | "neutral";

export interface MoodEntry {
  id: string;
  date: Date;
  mood: MoodType;
  note: string;
  messageCount: number;
}

export interface MoodStatistic {
  mood: MoodType;
  count: number;
  percentage: number;
}

export interface Insight {
  id: string;
  type: "pattern" | "streak" | "milestone" | "observation";
  title: string;
  description: string;
  mood?: MoodType;
  date: Date;
}

export interface SolaceMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  detectedMood?: MoodType;
}

export interface UseSolaceReturn {
  messages: SolaceMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  entries: MoodEntry[];
  moodStats: MoodStatistic[];
  insights: Insight[];
  currentStreak: number;
  totalCheckIns: number;
  hasEncryptionKey: boolean;
  generateEncryptionKey: () => Promise<void>;
}

// Therapeutic system prompt for the AI
const SOLACE_SYSTEM_PROMPT = `You are Solace, a gentle and empathetic AI companion focused on mental wellness and mood tracking.

Your role is to:
- Listen without judgment and validate feelings
- Ask thoughtful follow-up questions to help users explore their emotions
- Notice patterns in their mood over time ("You've mentioned stress a few times lately...")
- Offer gentle insights and observations
- Be warm, supportive, and calming

Communication style:
- Use a calm, reassuring tone
- Ask open-ended questions
- Acknowledge emotions before exploring them
- Be concise but caring
- Never be preachy or give unsolicited advice

Remember: You're a supportive companion, not a therapist. Focus on listening and reflecting.`;

// Simple mood detection based on keywords
function detectMood(text: string): MoodType {
  const lowerText = text.toLowerCase();

  const moodKeywords: Record<MoodType, string[]> = {
    joy: ["happy", "great", "wonderful", "excited", "joy", "amazing", "love", "grateful", "blessed", "fantastic", "good"],
    calm: ["calm", "peaceful", "relaxed", "content", "serene", "balanced", "okay", "fine", "alright"],
    sad: ["sad", "down", "depressed", "unhappy", "lonely", "miss", "grief", "crying", "tears", "empty", "low"],
    anxious: ["anxious", "worried", "nervous", "stressed", "overwhelmed", "panic", "fear", "scared", "uncertain", "tense"],
    angry: ["angry", "frustrated", "annoyed", "irritated", "mad", "furious", "upset", "hate", "rage"],
    neutral: [],
  };

  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return mood as MoodType;
    }
  }

  return "neutral";
}

export function useSolace(): UseSolaceReturn {
  const [messages, setMessages] = useState<SolaceMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [storedMemories, setStoredMemories] = useState<Array<{ value: string; createdAt?: number }>>([]);
  const messageIdRef = useRef(0);

  const { getAccessToken } = usePrivy();

  // SDK hooks with proper configuration
  const {
    isLoading,
    sendMessage: sdkSendMessage,
    stop,
  } = useChat({
    baseUrl: "https://api.reverbia.ai",
    getToken: async () => {
      const token = await getAccessToken();
      return token || "";
    },
  });

  const {
    extractMemoriesFromMessage,
    searchMemories,
  } = useMemory({
    completionsModel: "gpt-4o",
    embeddingModel: "text-embedding-3-small",
    generateEmbeddings: true,
    baseUrl: "https://api.reverbia.ai",
    getToken: async () => {
      const token = await getAccessToken();
      return token || "";
    },
  });

  const {
    hasEncryptionKey,
    generateEncryptionKey: sdkGenerateKey,
  } = useEncryption();

  const generateEncryptionKey = useCallback(async () => {
    try {
      await sdkGenerateKey();
    } catch (error) {
      console.error("Failed to generate encryption key:", error);
    }
  }, [sdkGenerateKey]);

  // Add initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: SolaceMessage = {
        id: `msg-${++messageIdRef.current}`,
        role: "assistant",
        content: "Hello, I'm here for you. How are you feeling today? Take your time - there's no rush.",
        timestamp: Date.now(),
      };
      setMessages([greeting]);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const detectedMood = detectMood(content);

    // Add user message
    const userMessage: SolaceMessage = {
      id: `msg-${++messageIdRef.current}`,
      role: "user",
      content,
      timestamp: Date.now(),
      detectedMood,
    };
    setMessages(prev => [...prev, userMessage]);

    // Prepare messages for API
    const chatHistory = messages.map(m => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    // Add system prompt
    const apiMessages = [
      { role: "system" as const, content: SOLACE_SYSTEM_PROMPT },
      ...chatHistory,
      { role: "user" as const, content },
    ];

    // Create placeholder for assistant response
    const assistantMessageId = `msg-${++messageIdRef.current}`;
    setStreamingContent("");

    try {
      await sdkSendMessage(
        {
          messages: apiMessages,
          model: "gpt-4o",
        },
        {
          onData: (chunk: string) => {
            setStreamingContent(prev => prev + chunk);
          },
          onFinish: (response: { choices: Array<{ message: { content: string } }> }) => {
            const finalContent = response.choices?.[0]?.message?.content || streamingContent;
            const assistantMessage: SolaceMessage = {
              id: assistantMessageId,
              role: "assistant",
              content: finalContent,
              timestamp: Date.now(),
            };
            setMessages(prev => [...prev, assistantMessage]);
            setStreamingContent("");

            // Extract memories in background
            if (detectedMood !== "neutral") {
              extractMemoriesFromMessage({
                messages: [
                  { role: "user", content },
                  { role: "assistant", content: finalContent },
                ],
                model: "gpt-4o",
              }).then((memories) => {
                if (memories && memories.length > 0) {
                  setStoredMemories(prev => [...prev, ...memories.map((m: { value: string }) => ({
                    value: m.value,
                    createdAt: Date.now(),
                  }))]);
                }
              }).catch(console.error);
            }
          },
          onError: (error: Error) => {
            console.error("Chat error:", error);
            const errorMessage: SolaceMessage = {
              id: assistantMessageId,
              role: "assistant",
              content: "I'm having trouble connecting right now. Please try again in a moment.",
              timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
            setStreamingContent("");
          },
        }
      );
    } catch (error) {
      console.error("Send message error:", error);
    }
  }, [messages, sdkSendMessage, extractMemoriesFromMessage, streamingContent]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingContent("");
  }, []);

  // Build mood entries from stored memories
  const entries: MoodEntry[] = useMemo(() => {
    return storedMemories
      .slice(0, 10)
      .map((m, i) => {
        let mood: MoodType = "neutral";
        const lowerValue = m.value.toLowerCase();
        if (lowerValue.includes("happy") || lowerValue.includes("joy") || lowerValue.includes("good")) mood = "joy";
        else if (lowerValue.includes("calm") || lowerValue.includes("peace")) mood = "calm";
        else if (lowerValue.includes("sad") || lowerValue.includes("down")) mood = "sad";
        else if (lowerValue.includes("anxious") || lowerValue.includes("stress") || lowerValue.includes("worried")) mood = "anxious";
        else if (lowerValue.includes("angry") || lowerValue.includes("frustrated")) mood = "angry";

        return {
          id: `entry-${i}`,
          date: new Date(m.createdAt || Date.now()),
          mood,
          note: m.value.substring(0, 50) + (m.value.length > 50 ? "..." : ""),
          messageCount: 1,
        };
      });
  }, [storedMemories]);

  // Calculate mood statistics
  const moodStats: MoodStatistic[] = useMemo(() => {
    const counts: Record<MoodType, number> = {
      joy: 0, calm: 0, sad: 0, anxious: 0, angry: 0, neutral: 0
    };

    entries.forEach(entry => {
      counts[entry.mood]++;
    });

    const total = entries.length || 1;
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([mood, count]) => ({
        mood: mood as MoodType,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [entries]);

  // Generate insights
  const insights: Insight[] = useMemo(() => {
    const result: Insight[] = [];

    const anxietyCount = storedMemories.filter(m =>
      m.value.toLowerCase().includes("stress") ||
      m.value.toLowerCase().includes("anxious") ||
      m.value.toLowerCase().includes("worried")
    ).length;

    if (anxietyCount >= 2) {
      result.push({
        id: "insight-anxiety",
        type: "observation",
        title: "Stress patterns",
        description: `You've mentioned stress or anxiety ${anxietyCount} times recently.`,
        mood: "anxious",
        date: new Date(),
      });
    }

    const joyCount = storedMemories.filter(m =>
      m.value.toLowerCase().includes("happy") ||
      m.value.toLowerCase().includes("grateful") ||
      m.value.toLowerCase().includes("joy")
    ).length;

    if (joyCount >= 2) {
      result.push({
        id: "insight-joy",
        type: "pattern",
        title: "Positive moments",
        description: `You've shared ${joyCount} positive experiences.`,
        mood: "joy",
        date: new Date(),
      });
    }

    if (entries.length >= 3) {
      result.push({
        id: "insight-streak",
        type: "streak",
        title: "Building awareness",
        description: `You've had ${entries.length} check-ins. Keep it up!`,
        date: new Date(),
      });
    }

    return result;
  }, [storedMemories, entries]);

  const currentStreak = entries.length;
  const totalCheckIns = storedMemories.length;

  return {
    messages: streamingContent
      ? [...messages, {
          id: "streaming",
          role: "assistant" as const,
          content: streamingContent,
          timestamp: Date.now(),
        }]
      : messages,
    isLoading,
    sendMessage,
    clearMessages,
    entries,
    moodStats,
    insights,
    currentStreak,
    totalCheckIns,
    hasEncryptionKey: hasEncryptionKey ?? false,
    generateEncryptionKey,
  };
}
