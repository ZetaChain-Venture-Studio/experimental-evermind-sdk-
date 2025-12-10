"use client";

import { useState, useCallback, useRef, useEffect } from "react";

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
}

// Therapeutic responses based on detected mood
const therapeuticResponses: Record<MoodType, string[]> = {
  joy: [
    "It's wonderful to hear you're feeling positive! What do you think contributed to this good feeling?",
    "That's great! I'd love to hear more about what's bringing you joy today.",
    "Your positive energy is lovely to see. What are you most grateful for right now?",
  ],
  calm: [
    "It sounds like you're in a peaceful place today. That's really valuable. How did you get here?",
    "Feeling calm is something to appreciate. What practices help you maintain this balance?",
    "I'm glad you're feeling centered. Is there anything on your mind you'd like to explore?",
  ],
  sad: [
    "I hear that you're going through a difficult time. It's okay to feel this way. Would you like to talk about what's on your mind?",
    "Thank you for sharing that with me. Sadness is a natural emotion. What do you think is at the heart of these feelings?",
    "I'm here for you. Sometimes just expressing our sadness can help lighten the load. Take your time.",
  ],
  anxious: [
    "I notice you might be feeling some anxiety. Let's take a breath together. What's weighing on you?",
    "Anxiety can be overwhelming. Remember, you're safe here. What specific thoughts are causing you worry?",
    "It's brave to acknowledge feeling anxious. Would it help to break down what's concerning you?",
  ],
  angry: [
    "It sounds like something has really frustrated you. I'm here to listen without judgment. What happened?",
    "Anger often signals that something important to us has been affected. Can you tell me more?",
    "I can sense some frustration in your words. It's healthy to express these feelings. What's at the root of this?",
  ],
  neutral: [
    "How are you feeling today? Is there anything specific you'd like to talk about?",
    "I'm here whenever you're ready to share. What's on your mind?",
    "Sometimes it's good to just check in. Is there anything you've been thinking about lately?",
  ],
};

// Initial greeting messages
const greetings = [
  "Good to see you. How are you feeling today?",
  "Welcome back. Is there anything you'd like to share?",
  "I'm here for you. What's been on your mind lately?",
  "Take your time. Whenever you're ready, I'm listening.",
];

// Simple mood detection based on keywords
function detectMood(text: string): MoodType {
  const lowerText = text.toLowerCase();

  const moodKeywords: Record<MoodType, string[]> = {
    joy: ["happy", "great", "wonderful", "excited", "joy", "amazing", "love", "grateful", "blessed", "fantastic"],
    calm: ["calm", "peaceful", "relaxed", "content", "serene", "balanced", "okay", "fine", "good"],
    sad: ["sad", "down", "depressed", "unhappy", "lonely", "miss", "grief", "crying", "tears", "empty"],
    anxious: ["anxious", "worried", "nervous", "stressed", "overwhelmed", "panic", "fear", "scared", "uncertain"],
    angry: ["angry", "frustrated", "annoyed", "irritated", "mad", "furious", "upset", "hate"],
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
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messageIdRef = useRef(0);

  // Mock data for entries
  const [entries] = useState<MoodEntry[]>([
    { id: "1", date: new Date(Date.now() - 86400000), mood: "calm", note: "Feeling centered today", messageCount: 4 },
    { id: "2", date: new Date(Date.now() - 172800000), mood: "anxious", note: "Work stress", messageCount: 6 },
    { id: "3", date: new Date(Date.now() - 259200000), mood: "joy", note: "Great day with friends", messageCount: 3 },
    { id: "4", date: new Date(Date.now() - 345600000), mood: "sad", note: "Missing family", messageCount: 5 },
    { id: "5", date: new Date(Date.now() - 432000000), mood: "calm", note: "Meditation helped", messageCount: 4 },
    { id: "6", date: new Date(Date.now() - 518400000), mood: "neutral", note: "Regular day", messageCount: 2 },
    { id: "7", date: new Date(Date.now() - 604800000), mood: "joy", note: "Promotion at work!", messageCount: 7 },
  ]);

  // Calculate mood statistics
  const moodStats: MoodStatistic[] = (() => {
    const counts: Record<MoodType, number> = {
      joy: 0, calm: 0, sad: 0, anxious: 0, angry: 0, neutral: 0
    };

    entries.forEach(entry => {
      counts[entry.mood]++;
    });

    const total = entries.length;
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([mood, count]) => ({
        mood: mood as MoodType,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  })();

  // Generate insights
  const insights: Insight[] = [
    {
      id: "1",
      type: "pattern",
      title: "Midweek calm",
      description: "You tend to feel most peaceful on Wednesdays. Consider what makes those days different.",
      mood: "calm",
      date: new Date(),
    },
    {
      id: "2",
      type: "observation",
      title: "Work-related stress",
      description: "You've mentioned work stress 3 times this week. Would you like to explore some coping strategies?",
      mood: "anxious",
      date: new Date(),
    },
    {
      id: "3",
      type: "streak",
      title: "Consistent check-ins",
      description: "You've checked in for 7 days in a row! This consistency is helping build self-awareness.",
      date: new Date(),
    },
  ];

  const currentStreak = 7;
  const totalCheckIns = entries.length;

  // Send initial greeting
  useEffect(() => {
    if (!hasGreeted) {
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      const greetingMessage: SolaceMessage = {
        id: `msg-${++messageIdRef.current}`,
        role: "assistant",
        content: greeting,
        timestamp: Date.now(),
      };
      setMessages([greetingMessage]);
      setHasGreeted(true);
    }
  }, [hasGreeted]);

  const sendMessage = useCallback(async (content: string) => {
    const detectedMood = detectMood(content);

    const userMessage: SolaceMessage = {
      id: `msg-${++messageIdRef.current}`,
      role: "user",
      content,
      timestamp: Date.now(),
      detectedMood,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const responses = therapeuticResponses[detectedMood];
    const response = responses[Math.floor(Math.random() * responses.length)];

    const assistantMessage: SolaceMessage = {
      id: `msg-${++messageIdRef.current}`,
      role: "assistant",
      content: response,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setHasGreeted(false);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    entries,
    moodStats,
    insights,
    currentStreak,
    totalCheckIns,
  };
}
