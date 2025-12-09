"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useChat, useMemory, useEncryption } from "@reverbia/sdk";

const VAULT_COMPANION_PROMPT = `You are a thoughtful AI journal companion inside a private, encrypted vault.
Your role is to help the user process their thoughts and emotions.

Be:
- Reflective and insightful - help them see things from new angles
- Gentle with difficult emotions - validate before exploring
- Encouraging of self-exploration - ask follow-up questions
- Able to spot patterns - "You've mentioned X a few times..."
- Present and attentive - like a wise, trusted friend

When responding:
- Ask follow-up questions that go deeper
- Occasionally reference past entries if relevant
- Help them see their own growth over time
- Notice emotional patterns across conversations
- Be warm but not overly effusive

Remember: This person trusts you with things they can't tell anyone else.
This space is truly private and encrypted. Honor that trust.`;

export interface VaultMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface VaultEntry {
  id: string;
  date: Date;
  preview: string;
  messageCount: number;
}

export interface PatternInsight {
  id: string;
  title: string;
  description: string;
  trend: "up" | "down" | "stable";
  frequency: number;
}

export interface UseVaultOptions {
  onEntryCreated?: (entry: VaultEntry) => void;
}

export interface UseVaultReturn {
  messages: VaultMessage[];
  isLoading: boolean;
  hasEncryptionKey: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  generateEncryptionKey: () => Promise<void>;
  entries: VaultEntry[];
  patterns: PatternInsight[];
  analyzePatterns: () => Promise<void>;
}

export function useVault(options: UseVaultOptions = {}): UseVaultReturn {
  const [messages, setMessages] = useState<VaultMessage[]>([]);
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [patterns, setPatterns] = useState<PatternInsight[]>([]);
  const messageIdRef = useRef(0);

  // SDK hooks
  const {
    messages: chatMessages,
    sendMessage: sdkSendMessage,
    isLoading,
    clearMessages: sdkClearMessages,
  } = useChat({
    model: "gpt-4o",
    systemPrompt: VAULT_COMPANION_PROMPT,
  });

  const {
    memories,
    extractMemoriesFromMessage,
    searchMemories,
    clearAllMemories,
  } = useMemory({
    namespace: "vault",
  });

  const {
    hasEncryptionKey,
    generateEncryptionKey: sdkGenerateKey,
    encryptData,
    decryptData,
  } = useEncryption();

  // Convert SDK messages to vault messages
  useEffect(() => {
    const vaultMessages: VaultMessage[] = chatMessages.map((msg, i) => ({
      id: `msg-${i}`,
      role: msg.role as "user" | "assistant",
      content: typeof msg.content === "string" ? msg.content : "",
      timestamp: Date.now() - (chatMessages.length - i) * 1000,
    }));
    setMessages(vaultMessages);
  }, [chatMessages]);

  const generateEncryptionKey = useCallback(async () => {
    await sdkGenerateKey();
  }, [sdkGenerateKey]);

  const sendMessage = useCallback(
    async (content: string) => {
      // Send to chat
      await sdkSendMessage(content);

      // Extract memories from the conversation
      // Get the last assistant message for context
      const lastAssistantMsg = chatMessages
        .filter((m) => m.role === "assistant")
        .pop();

      if (lastAssistantMsg) {
        try {
          await extractMemoriesFromMessage(
            content,
            typeof lastAssistantMsg.content === "string"
              ? lastAssistantMsg.content
              : ""
          );
        } catch (error) {
          console.error("Memory extraction failed:", error);
        }
      }
    },
    [sdkSendMessage, chatMessages, extractMemoriesFromMessage]
  );

  const clearMessages = useCallback(() => {
    sdkClearMessages();
    setMessages([]);
  }, [sdkClearMessages]);

  const analyzePatterns = useCallback(async () => {
    try {
      // Search for emotional content
      const emotionalMemories = await searchMemories(
        "stressed anxious happy sad worried excited angry frustrated calm peaceful",
        { limit: 50 }
      );

      // Analyze patterns from memories
      const patternMap = new Map<string, number>();

      emotionalMemories.forEach((memory) => {
        const lowerValue = memory.value.toLowerCase();

        // Count emotional mentions
        const emotions = [
          "stress",
          "anxiety",
          "happy",
          "sad",
          "worried",
          "excited",
          "angry",
          "frustrated",
          "calm",
          "peaceful",
        ];

        emotions.forEach((emotion) => {
          if (lowerValue.includes(emotion)) {
            patternMap.set(
              emotion,
              (patternMap.get(emotion) || 0) + 1
            );
          }
        });
      });

      // Convert to pattern insights
      const insights: PatternInsight[] = Array.from(patternMap.entries())
        .filter(([_, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([emotion, count], index) => ({
          id: `pattern-${index}`,
          title: `Mentions of "${emotion}"`,
          description: `You've mentioned feeling ${emotion} ${count} times recently.`,
          trend: count > 3 ? "up" : "stable",
          frequency: count,
        }));

      setPatterns(insights);
    } catch (error) {
      console.error("Pattern analysis failed:", error);
    }
  }, [searchMemories]);

  // Load entries from memories on mount
  useEffect(() => {
    const loadedEntries: VaultEntry[] = memories
      .filter((m) => m.type === "identity" || m.type === "preference")
      .slice(0, 10)
      .map((m, i) => ({
        id: `entry-${i}`,
        date: new Date(m.createdAt || Date.now()),
        preview: m.value.substring(0, 100) + "...",
        messageCount: 1,
      }));

    setEntries(loadedEntries);
  }, [memories]);

  return {
    messages,
    isLoading,
    hasEncryptionKey,
    sendMessage,
    clearMessages,
    generateEncryptionKey,
    entries,
    patterns,
    analyzePatterns,
  };
}
