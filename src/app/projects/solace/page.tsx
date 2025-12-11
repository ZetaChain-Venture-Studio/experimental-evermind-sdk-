"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ArrowLeft,
  Send,
  Sparkles,
  BarChart3,
  Calendar,
  TrendingUp,
  Heart,
  Sun,
  Cloud,
  CloudRain,
  Zap,
  Flame,
  Minus,
} from "lucide-react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { EvermindBadge } from "@/components/evermind-badge";

type MoodType = "joy" | "calm" | "sad" | "anxious" | "angry" | "neutral";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  detectedMood?: MoodType;
}

interface MoodEntry {
  mood: MoodType;
  count: number;
  percentage: number;
}

const moodConfig: Record<MoodType, { icon: typeof Heart; color: string; bgColor: string; label: string }> = {
  joy: { icon: Sun, color: "text-amber-500", bgColor: "bg-amber-100", label: "Joyful" },
  calm: { icon: Cloud, color: "text-sky-500", bgColor: "bg-sky-100", label: "Calm" },
  sad: { icon: CloudRain, color: "text-blue-500", bgColor: "bg-blue-100", label: "Sad" },
  anxious: { icon: Zap, color: "text-orange-500", bgColor: "bg-orange-100", label: "Anxious" },
  angry: { icon: Flame, color: "text-red-500", bgColor: "bg-red-100", label: "Frustrated" },
  neutral: { icon: Minus, color: "text-gray-500", bgColor: "bg-gray-100", label: "Neutral" },
};

const therapistResponses: Record<string, string[]> = {
  greeting: [
    "Hello! I'm here to listen. How are you feeling today?",
    "Welcome back. Take a moment to check in with yourself - how are you doing right now?",
    "Hi there. This is your safe space. What's on your mind today?",
  ],
  joy: [
    "That's wonderful to hear! What do you think is contributing to these positive feelings?",
    "I'm glad you're feeling good! It's important to recognize and savor these moments. What made today special?",
    "That's great! Positive emotions are worth exploring too. What brings you this joy?",
  ],
  sad: [
    "I hear you. It's okay to feel sad sometimes. Would you like to explore what might be causing these feelings?",
    "Thank you for sharing that with me. Sadness can be heavy to carry. What do you think is weighing on you?",
    "I'm here for you. Sometimes naming our feelings helps us process them. What's making you feel this way?",
  ],
  anxious: [
    "Anxiety can be overwhelming. Let's try to understand what's triggering these feelings. What's been on your mind?",
    "I notice you're feeling anxious. That's a difficult emotion to sit with. What feels most pressing right now?",
    "It takes courage to acknowledge anxiety. Would you like to talk about what's causing this unease?",
  ],
  angry: [
    "Anger is a valid emotion. It often signals that something important to us has been crossed. What happened?",
    "I can sense your frustration. Sometimes anger protects us from deeper feelings. What's behind this?",
    "Thank you for being honest about how you feel. Anger often has important things to tell us. What triggered this?",
  ],
  neutral: [
    "Sometimes neutral is exactly where we need to be. Is there anything specific you'd like to explore today?",
    "That's okay. Not every day has strong emotions. Is there anything on your mind you'd like to discuss?",
    "Being in a neutral space can be peaceful. What would you like to focus on in our conversation?",
  ],
  followup: [
    "That's really insightful. How long have you been feeling this way?",
    "Thank you for sharing that. It sounds like this has been on your mind. What do you think would help?",
    "I appreciate you opening up. Have you noticed any patterns with when these feelings arise?",
    "That makes sense. Our feelings often connect to deeper needs. What do you think you need right now?",
    "I hear you. It's important to acknowledge these feelings. What's one small thing that might bring you comfort?",
  ],
};

const detectMood = (text: string): MoodType => {
  const lower = text.toLowerCase();
  if (/happy|joy|excited|great|amazing|wonderful|love|fantastic/.test(lower)) return "joy";
  if (/calm|peaceful|relaxed|serene|content|okay|fine/.test(lower)) return "calm";
  if (/sad|down|depressed|unhappy|crying|hurt|lonely|miss/.test(lower)) return "sad";
  if (/anxious|worried|nervous|stressed|overwhelmed|panic|afraid|scared/.test(lower)) return "anxious";
  if (/angry|frustrated|annoyed|mad|furious|irritated|upset/.test(lower)) return "angry";
  return "neutral";
};

export default function SolacePage() {
  const { authenticated, ready, login } = usePrivy();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  const [moodStats] = useState<MoodEntry[]>([
    { mood: "calm", count: 5, percentage: 35 },
    { mood: "joy", count: 4, percentage: 28 },
    { mood: "anxious", count: 3, percentage: 21 },
    { mood: "sad", count: 1, percentage: 8 },
    { mood: "neutral", count: 1, percentage: 8 },
  ]);

  const [streak] = useState(5);

  // Initialize with greeting
  useEffect(() => {
    if (authenticated && messages.length === 0) {
      const greeting = therapistResponses.greeting[Math.floor(Math.random() * therapistResponses.greeting.length)];
      setMessages([{
        id: `msg-${++messageIdRef.current}`,
        role: "assistant",
        content: greeting,
        timestamp: Date.now(),
      }]);
    }
  }, [authenticated, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    const detectedMood = detectMood(userMessage);
    setInput("");

    // Add user message
    const userMsg: Message = {
      id: `msg-${++messageIdRef.current}`,
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
      detectedMood,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Simulate typing
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Get appropriate response
    const responsePool = messages.length < 3
      ? therapistResponses[detectedMood]
      : therapistResponses.followup;
    const response = responsePool[Math.floor(Math.random() * responsePool.length)];

    const assistantMsg: Message = {
      id: `msg-${++messageIdRef.current}`,
      role: "assistant",
      content: response,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="animate-pulse text-purple-500">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50">
        <header className="fixed top-0 left-0 right-0 z-50 glass">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <EvermindBadge size="sm" />
          </div>
        </header>

        <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-gray-900 mb-3">
              Solace
            </h1>
            <p className="text-gray-600 mb-8">
              Your gentle AI companion for mental wellness and self-reflection.
            </p>
            <button
              onClick={login}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              Begin Your Journey
            </button>
          </motion.div>

          <div className="absolute bottom-8">
            <EvermindBadge variant="light" size="md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-gray-900">Solace</span>
          </div>
          <button
            onClick={() => setShowStats(!showStats)}
            className={`p-2 rounded-lg transition-colors ${showStats ? "bg-purple-100 text-purple-600" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <BarChart3 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex pt-16">
        {/* Chat Area */}
        <main className={`flex-1 flex flex-col transition-all duration-300 ${showStats ? "mr-80" : ""}`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`px-5 py-4 max-w-md rounded-2xl ${
                        message.role === "user"
                          ? "bg-purple-500 text-white rounded-br-sm"
                          : "bg-white/80 text-gray-700 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                      {message.detectedMood && message.detectedMood !== "neutral" && (
                        <div className={`flex items-center gap-2 mt-2 pt-2 border-t ${
                          message.role === "user" ? "border-white/20" : "border-gray-100"
                        }`}>
                          {(() => {
                            const config = moodConfig[message.detectedMood];
                            const Icon = config.icon;
                            return (
                              <>
                                <Icon className={`w-4 h-4 ${message.role === "user" ? "text-white/80" : config.color}`} />
                                <span className={`text-xs ${message.role === "user" ? "text-white/80" : "text-gray-500"}`}>
                                  Feeling {config.label.toLowerCase()}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/80 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-purple-100 bg-white/50 backdrop-blur-sm">
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Share what's on your mind..."
                  className="flex-1 px-5 py-3 bg-white border border-purple-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">
                Your conversations help track emotional patterns over time
              </p>
            </div>
          </div>
        </main>

        {/* Stats Sidebar */}
        <AnimatePresence>
          {showStats && (
            <motion.aside
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              className="fixed right-0 top-16 bottom-0 w-80 bg-white/80 backdrop-blur-sm border-l border-purple-100 overflow-y-auto p-6"
            >
              {/* Streak */}
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-5 text-white mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/80 text-sm">Check-in streak</span>
                  <Calendar className="w-5 h-5 text-white/60" />
                </div>
                <div className="text-4xl font-bold mb-2">{streak} days</div>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full ${i < streak ? "bg-white" : "bg-white/30"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Mood Distribution */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">This Week's Moods</h3>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {moodStats.map((stat) => {
                    const config = moodConfig[stat.mood];
                    const Icon = config.icon;
                    return (
                      <div key={stat.mood}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${config.color}`} />
                            <span className="text-gray-600">{config.label}</span>
                          </div>
                          <span className="font-medium">{stat.percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${config.bgColor} rounded-full transition-all`}
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insights */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Insights</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <p className="text-sm text-purple-900 font-medium mb-1">Pattern Detected</p>
                    <p className="text-xs text-purple-700">You tend to feel calmer in the mornings. Consider scheduling important tasks early.</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-sm text-amber-900 font-medium mb-1">Positive Trend</p>
                    <p className="text-xs text-amber-700">Your joy entries increased 20% this week compared to last week!</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Badge */}
      <div className="fixed bottom-4 left-4">
        <EvermindBadge variant="light" size="md" />
      </div>
    </div>
  );
}
