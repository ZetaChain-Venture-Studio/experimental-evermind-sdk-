"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  ArrowLeft,
  Check,
  ShoppingBag,
  Heart,
  Car,
  Utensils,
  Briefcase,
  Music,
  MapPin,
  Activity,
  Lock,
  Unlock,
  Wallet,
  Database,
  Sparkles,
  Send,
  X,
  MessageCircle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePrivy, useIdentityToken } from "@privy-io/react-auth";
import { EvermindBadge } from "@/components/evermind-badge";

const API_BASE_URL = "https://ai-portal-dev.zetachain.com";

interface MemoryCategory {
  id: string;
  name: string;
  icon: typeof DollarSign;
  description: string;
  valuePerMemory: number;
  requiredMemories: number;
  currentMemories: number;
  questions: string[];
  unlocked: boolean;
}

const initialCategories: MemoryCategory[] = [
  {
    id: "shopping",
    name: "Shopping Preferences",
    icon: ShoppingBag,
    description: "Products, brands, shopping habits",
    valuePerMemory: 0.15,
    requiredMemories: 10,
    currentMemories: 0,
    questions: [
      "What are your favorite brands for clothing?",
      "How often do you shop online vs in-store?",
      "What's your typical budget for a shopping trip?",
    ],
    unlocked: false,
  },
  {
    id: "food",
    name: "Food & Dining",
    icon: Utensils,
    description: "Restaurants, cuisines, dietary preferences",
    valuePerMemory: 0.12,
    requiredMemories: 8,
    currentMemories: 0,
    questions: [
      "What's your favorite type of cuisine?",
      "Do you have any dietary restrictions?",
      "How often do you eat out per week?",
    ],
    unlocked: false,
  },
  {
    id: "health",
    name: "Health & Wellness",
    icon: Heart,
    description: "Fitness goals, health conditions, routines",
    valuePerMemory: 0.85,
    requiredMemories: 15,
    currentMemories: 0,
    questions: [
      "What are your main health goals?",
      "Do you take any supplements or vitamins?",
      "How would you describe your sleep quality?",
    ],
    unlocked: false,
  },
  {
    id: "driving",
    name: "Driving Habits",
    icon: Car,
    description: "Commute patterns, vehicle preferences",
    valuePerMemory: 0.35,
    requiredMemories: 12,
    currentMemories: 0,
    questions: [
      "What type of car do you drive or prefer?",
      "How long is your daily commute?",
      "Do you prefer highway or city driving?",
    ],
    unlocked: false,
  },
  {
    id: "work",
    name: "Professional Life",
    icon: Briefcase,
    description: "Career goals, work preferences, industry",
    valuePerMemory: 0.45,
    requiredMemories: 10,
    currentMemories: 0,
    questions: [
      "What industry do you work in?",
      "Do you prefer remote or in-office work?",
      "What are your career aspirations?",
    ],
    unlocked: false,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Music,
    description: "Music, movies, shows, hobbies",
    valuePerMemory: 0.08,
    requiredMemories: 8,
    currentMemories: 0,
    questions: [
      "What music genres do you listen to most?",
      "What streaming services do you use?",
      "What's your favorite hobby?",
    ],
    unlocked: false,
  },
  {
    id: "travel",
    name: "Travel Patterns",
    icon: MapPin,
    description: "Destinations, travel style, vacations",
    valuePerMemory: 0.28,
    requiredMemories: 10,
    currentMemories: 0,
    questions: [
      "What's your dream travel destination?",
      "Do you prefer adventure or relaxation trips?",
      "How often do you travel per year?",
    ],
    unlocked: false,
  },
  {
    id: "fitness",
    name: "Fitness Data",
    icon: Activity,
    description: "Workout routines, activity levels, goals",
    valuePerMemory: 0.42,
    requiredMemories: 12,
    currentMemories: 0,
    questions: [
      "What type of exercise do you enjoy most?",
      "How many times per week do you work out?",
      "Do you use any fitness apps or wearables?",
    ],
    unlocked: false,
  },
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function WorthAIPage() {
  const { authenticated, ready, login, logout } = usePrivy();
  const { identityToken } = useIdentityToken();
  const [phase, setPhase] = useState<"connect" | "calculating" | "dashboard">("connect");
  const [categories, setCategories] = useState<MemoryCategory[]>(initialCategories);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [displayedValue, setDisplayedValue] = useState(0);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selling, setSelling] = useState(false);
  const [sold, setSold] = useState(false);

  // Chat modal state
  const [chatCategory, setChatCategory] = useState<MemoryCategory | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const totalValue = categories.reduce((acc, c) => acc + (c.currentMemories * c.valuePerMemory), 0);
  const potentialValue = categories.reduce((acc, c) => acc + (c.requiredMemories * c.valuePerMemory), 0);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleConnect = async () => {
    setPhase("calculating");

    // Simulate calculation with random values
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 50));
      setCalculationProgress(i);
    }

    // Set random initial memories for each category
    setCategories(prev => prev.map(c => {
      const memories = Math.floor(Math.random() * (c.requiredMemories * 0.7));
      return {
        ...c,
        currentMemories: memories,
        unlocked: memories >= c.requiredMemories,
      };
    }));

    // Animate the value counter
    const finalValue = categories.reduce((acc, c) => {
      const memories = Math.floor(Math.random() * (c.requiredMemories * 0.7));
      return acc + (memories * c.valuePerMemory);
    }, 0);

    let currentValue = 0;
    const increment = finalValue / 50;
    const valueInterval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= finalValue) {
        currentValue = finalValue;
        clearInterval(valueInterval);
      }
      setDisplayedValue(currentValue);
    }, 30);

    setTimeout(() => {
      setPhase("dashboard");
    }, 500);
  };

  const openChatForCategory = (category: MemoryCategory) => {
    setChatCategory(category);
    setAnsweredQuestions(0);
    setChatMessages([{
      role: "assistant",
      content: `Hi! I'm here to help you share memories about your ${category.name.toLowerCase()}. Each answer earns you more USDC! Let me start with a question:\n\n${category.questions[0]}`,
    }]);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !chatCategory || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsChatLoading(true);

    // Increment memories for this category
    const newAnsweredCount = answeredQuestions + 1;
    setAnsweredQuestions(newAnsweredCount);

    setCategories(prev => prev.map(c => {
      if (c.id === chatCategory.id) {
        const newMemories = Math.min(c.currentMemories + 1, c.requiredMemories);
        return {
          ...c,
          currentMemories: newMemories,
          unlocked: newMemories >= c.requiredMemories,
        };
      }
      return c;
    }));

    // Generate AI response
    try {
      if (identityToken) {
        const response = await fetch(`${API_BASE_URL}/api/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${identityToken}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: `You are a friendly data collection assistant helping users share information about their ${chatCategory.name}.
                After they answer, thank them briefly (1 sentence) and ask another relevant question to gather more data.
                Be warm but concise. Focus on gathering specific, valuable data points.
                The user has answered ${newAnsweredCount} question(s) so far.`,
              },
              ...chatMessages.map(m => ({ role: m.role, content: m.content })),
              { role: "user", content: userMessage },
            ],
            model: "openai/gpt-4o",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data?.choices?.[0]?.message?.content || getNextQuestion(chatCategory, newAnsweredCount);
          setChatMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
        } else {
          setChatMessages(prev => [...prev, { role: "assistant", content: getNextQuestion(chatCategory, newAnsweredCount) }]);
        }
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", content: getNextQuestion(chatCategory, newAnsweredCount) }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: "assistant", content: getNextQuestion(chatCategory, newAnsweredCount) }]);
    }

    setIsChatLoading(false);
  };

  const getNextQuestion = (category: MemoryCategory, count: number): string => {
    if (count >= category.questions.length) {
      return "Great! You've shared a lot. Feel free to tell me more about your preferences, or close this chat to see your updated value!";
    }
    return `Thanks for sharing! Here's another question:\n\n${category.questions[count]}`;
  };

  const handleSell = async () => {
    setSelling(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSelling(false);
    setSold(true);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-emerald-500">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <header className="fixed top-0 left-0 right-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <EvermindBadge size="sm" variant="dark" />
          </div>
        </header>

        <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30"
            >
              <DollarSign className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="font-display text-4xl font-bold text-white mb-4">
              Worth AI
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Discover how much your data is worth and get paid in USDC.
            </p>
            <button
              onClick={login}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all text-lg"
            >
              Sign In to Start
            </button>
          </motion.div>

          <div className="absolute bottom-8">
            <EvermindBadge variant="dark" size="md" />
          </div>
        </div>
      </div>
    );
  }

  // Connect Phase - Just the button
  if (phase === "connect") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
        <button
          onClick={logout}
          className="absolute top-6 right-6 p-2 rounded-lg text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>

        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40"
            >
              <Database className="w-16 h-16 text-white" />
            </motion.div>

            <h1 className="font-display text-5xl font-bold text-white mb-4">
              Your Data Has Value
            </h1>
            <p className="text-gray-400 text-xl mb-12 max-w-lg mx-auto">
              Connect your memories to discover what your data is worth to advertisers, researchers, and AI companies.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConnect}
              className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-emerald-500/30 transition-all text-xl flex items-center gap-3 mx-auto"
            >
              <Sparkles className="w-6 h-6" />
              Connect My Memories
            </motion.button>
          </motion.div>

          <div className="absolute bottom-8">
            <EvermindBadge variant="dark" size="md" />
          </div>
        </div>
      </div>
    );
  }

  // Calculating Phase - Animation
  if (phase === "calculating") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 mx-auto mb-8"
          />

          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Analyzing Your Data...
          </h2>

          <div className="w-80 h-3 bg-gray-700 rounded-full overflow-hidden mx-auto mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400"
              style={{ width: `${calculationProgress}%` }}
            />
          </div>

          <p className="text-gray-400">
            {calculationProgress < 30 && "Scanning memory categories..."}
            {calculationProgress >= 30 && calculationProgress < 60 && "Calculating data value..."}
            {calculationProgress >= 60 && calculationProgress < 90 && "Checking market rates..."}
            {calculationProgress >= 90 && "Finalizing your worth..."}
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: calculationProgress > 50 ? 1 : 0 }}
            className="text-4xl font-bold text-emerald-400 mt-8"
          >
            ${displayedValue.toFixed(2)} USDC
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Dashboard Phase
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-gray-900">Worth AI</span>
          </div>
          <div className="flex items-center gap-3">
            <EvermindBadge size="sm" />
            <button
              onClick={logout}
              className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Value Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 mb-8 text-white shadow-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Your Data is Worth</p>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-6xl font-bold">
                    ${totalValue.toFixed(2)}
                  </span>
                  <span className="text-emerald-400 text-2xl font-semibold">USDC</span>
                </div>
                <p className="text-gray-500 mt-2">
                  Potential: ${potentialValue.toFixed(2)} USDC
                </p>
              </div>

              <button
                onClick={() => setShowSellModal(true)}
                disabled={totalValue === 0}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Claim USDC
              </button>
            </div>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {categories.map((category, index) => {
              const categoryValue = category.currentMemories * category.valuePerMemory;
              const progress = (category.currentMemories / category.requiredMemories) * 100;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        category.unlocked ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        <category.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-xs text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-lg ${category.unlocked ? "text-emerald-600" : "text-gray-600"}`}>
                        ${categoryValue.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">USDC</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">
                        {category.currentMemories}/{category.requiredMemories} memories
                      </span>
                      {category.unlocked ? (
                        <span className="text-emerald-500 flex items-center gap-1">
                          <Unlock className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-gray-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> {category.requiredMemories - category.currentMemories} more needed
                        </span>
                      )}
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          category.unlocked ? "bg-emerald-500" : "bg-emerald-300"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Farm Button */}
                  {!category.unlocked && (
                    <button
                      onClick={() => openChatForCategory(category)}
                      className="w-full py-2.5 bg-emerald-50 text-emerald-600 font-medium rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Farm Memories (+${category.valuePerMemory.toFixed(2)}/answer)
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Chat Modal */}
      <AnimatePresence>
        {chatCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-lg md:mx-6 max-h-[80vh] flex flex-col shadow-2xl"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <chatCategory.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{chatCategory.name}</h3>
                    <p className="text-xs text-emerald-600">
                      +${chatCategory.valuePerMemory.toFixed(2)} USDC per answer
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setChatCategory(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-emerald-500 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-700 rounded-bl-sm"
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                    placeholder="Share your thoughts..."
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sell Modal */}
      <AnimatePresence>
        {showSellModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/50 backdrop-blur-sm"
            onClick={() => !selling && setShowSellModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              {sold ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-gray-900 mb-2">
                    Payment Sent!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    ${totalValue.toFixed(2)} USDC has been sent to your wallet.
                  </p>
                  <button
                    onClick={() => {
                      setShowSellModal(false);
                      setSold(false);
                    }}
                    className="w-full py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <Wallet className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="font-display text-2xl font-semibold text-gray-900">
                      Claim Your USDC
                    </h2>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
                    <p className="text-gray-500 text-sm mb-1">You'll receive</p>
                    <p className="text-4xl font-bold text-emerald-600">
                      ${totalValue.toFixed(2)} <span className="text-lg">USDC</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleSell}
                      disabled={selling}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-70"
                    >
                      {selling ? "Processing..." : "Confirm Claim"}
                    </button>
                    <button
                      onClick={() => setShowSellModal(false)}
                      disabled={selling}
                      className="w-full py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Badge */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <EvermindBadge variant="light" size="md" />
      </div>
    </div>
  );
}
