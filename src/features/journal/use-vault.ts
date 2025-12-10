"use client";

import { useState, useCallback, useRef, useEffect } from "react";

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

// Mock responses for demo purposes
const mockResponses = [
  "That's a thoughtful reflection. What made you think about this today?",
  "I hear you. It sounds like this has been on your mind. Can you tell me more about how it makes you feel?",
  "Thank you for sharing that with me. This vault is a safe space for these thoughts. What would help you process this further?",
  "I notice you've been reflecting on similar themes lately. Do you see any patterns emerging?",
  "That's an important insight. How does recognizing this change how you feel about the situation?",
];

export function useVault(options: UseVaultOptions = {}): UseVaultReturn {
  const [messages, setMessages] = useState<VaultMessage[]>([]);
  const [entries, setEntries] = useState<VaultEntry[]>([
    {
      id: "entry-1",
      date: new Date(Date.now() - 86400000),
      preview: "Reflecting on my goals for this week...",
      messageCount: 4,
    },
    {
      id: "entry-2",
      date: new Date(Date.now() - 172800000),
      preview: "Had an interesting conversation today...",
      messageCount: 6,
    },
  ]);
  const [patterns, setPatterns] = useState<PatternInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasEncryptionKey, setHasEncryptionKey] = useState(false);
  const messageIdRef = useRef(0);

  const generateEncryptionKey = useCallback(async () => {
    // Simulate key generation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setHasEncryptionKey(true);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessageId = `msg-${++messageIdRef.current}`;
    const userMessage: VaultMessage = {
      id: userMessageId,
      role: "user",
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const assistantMessageId = `msg-${++messageIdRef.current}`;
    const responseIndex = Math.floor(Math.random() * mockResponses.length);
    const assistantMessage: VaultMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: mockResponses[responseIndex],
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const analyzePatterns = useCallback(async () => {
    // Simulate pattern analysis
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setPatterns([
      {
        id: "pattern-1",
        title: "Mentions of reflection",
        description: "You've been reflecting more frequently lately.",
        trend: "up",
        frequency: 5,
      },
      {
        id: "pattern-2",
        title: "Growth mindset",
        description: "Your entries show increasing self-awareness.",
        trend: "up",
        frequency: 3,
      },
    ]);
  }, []);

  // Auto-generate encryption key after mount
  useEffect(() => {
    if (!hasEncryptionKey) {
      const timer = setTimeout(() => {
        setHasEncryptionKey(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasEncryptionKey]);

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
