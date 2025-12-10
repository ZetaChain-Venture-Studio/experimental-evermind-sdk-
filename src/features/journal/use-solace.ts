"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useChat, useMemory, useEncryption } from "@reverbia/sdk/react";

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
  const [solaceMessages, setSolaceMessages] = useState<SolaceMessage[]>([]);
  const messageIdRef = useRef(0);

  // SDK hooks
  const {
    messages: chatMessages,
    sendMessage: sdkSendMessage,
    isLoading,
    clearMessages: sdkClearMessages,
  } = useChat({
    model: "gpt-4o",
    systemPrompt: SOLACE_SYSTEM_PROMPT,
  });

  const {
    memories,
    extractMemoriesFromMessage,
    searchMemories,
  } = useMemory({
    namespace: "solace-mood",
  });

  const {
    hasEncryptionKey,
    generateEncryptionKey: sdkGenerateKey,
  } = useEncryption();

  // Convert SDK messages to Solace messages
  useEffect(() => {
    const converted: SolaceMessage[] = chatMessages.map((msg, i) => ({
      id: `msg-${i}`,
      role: msg.role as "user" | "assistant",
      content: typeof msg.content === "string" ? msg.content : "",
      timestamp: Date.now() - (chatMessages.length - i) * 1000,
      detectedMood: msg.role === "user" ? detectMood(typeof msg.content === "string" ? msg.content : "") : undefined,
    }));
    setSolaceMessages(converted);
  }, [chatMessages]);

  // Send initial greeting if no messages
  useEffect(() => {
    if (chatMessages.length === 0 && !isLoading) {
      // The SDK will handle the initial message via system prompt
    }
  }, [chatMessages.length, isLoading]);

  const generateEncryptionKey = useCallback(async () => {
    await sdkGenerateKey();
  }, [sdkGenerateKey]);

  const sendMessage = useCallback(async (content: string) => {
    // Send to chat
    await sdkSendMessage(content);

    // Extract memories for mood tracking
    try {
      const detectedMood = detectMood(content);
      // Extract any emotional content as memories
      if (detectedMood !== "neutral") {
        await extractMemoriesFromMessage(
          content,
          `User expressed feeling ${detectedMood}`
        );
      }
    } catch (error) {
      console.error("Memory extraction failed:", error);
    }
  }, [sdkSendMessage, extractMemoriesFromMessage]);

  const clearMessages = useCallback(() => {
    sdkClearMessages();
    setSolaceMessages([]);
  }, [sdkClearMessages]);

  // Build mood entries from memories
  const entries: MoodEntry[] = useMemo(() => {
    return memories
      .filter(m => m.value.includes("feeling") || m.type === "identity")
      .slice(0, 10)
      .map((m, i) => {
        // Try to detect mood from memory content
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
  }, [memories]);

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

  // Generate insights from memories
  const insights: Insight[] = useMemo(() => {
    const result: Insight[] = [];

    // Check for repeated themes
    const anxietyCount = memories.filter(m =>
      m.value.toLowerCase().includes("stress") ||
      m.value.toLowerCase().includes("anxious") ||
      m.value.toLowerCase().includes("worried")
    ).length;

    if (anxietyCount >= 2) {
      result.push({
        id: "insight-anxiety",
        type: "observation",
        title: "Stress patterns",
        description: `You've mentioned stress or anxiety ${anxietyCount} times recently. Would you like to explore some calming techniques?`,
        mood: "anxious",
        date: new Date(),
      });
    }

    const joyCount = memories.filter(m =>
      m.value.toLowerCase().includes("happy") ||
      m.value.toLowerCase().includes("grateful") ||
      m.value.toLowerCase().includes("joy")
    ).length;

    if (joyCount >= 2) {
      result.push({
        id: "insight-joy",
        type: "pattern",
        title: "Positive moments",
        description: `You've shared ${joyCount} positive experiences. What do these moments have in common?`,
        mood: "joy",
        date: new Date(),
      });
    }

    // Add streak insight
    if (entries.length >= 3) {
      result.push({
        id: "insight-streak",
        type: "streak",
        title: "Building awareness",
        description: `You've had ${entries.length} check-ins. Consistency is key to understanding your patterns.`,
        date: new Date(),
      });
    }

    return result;
  }, [memories, entries]);

  const currentStreak = entries.length;
  const totalCheckIns = memories.length;

  return {
    messages: solaceMessages,
    isLoading,
    sendMessage,
    clearMessages,
    entries,
    moodStats,
    insights,
    currentStreak,
    totalCheckIns,
    hasEncryptionKey,
    generateEncryptionKey,
  };
}
