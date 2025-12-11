"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  ArrowLeft,
  Check,
  ChevronRight,
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
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { EvermindBadge } from "@/components/evermind-badge";

interface MemoryCategory {
  id: string;
  name: string;
  icon: typeof DollarSign;
  description: string;
  value: number; // in cents (USDC)
  requiredMemories: number;
  currentMemories: number;
  examples: string[];
  unlocked: boolean;
}

const memoryCategories: MemoryCategory[] = [
  {
    id: "shopping",
    name: "Shopping Preferences",
    icon: ShoppingBag,
    description: "Products you like, brands you prefer, shopping habits",
    value: 15,
    requiredMemories: 10,
    currentMemories: 10,
    examples: ["Favorite brands", "Purchase frequency", "Price sensitivity"],
    unlocked: true,
  },
  {
    id: "food",
    name: "Food & Dining",
    icon: Utensils,
    description: "Restaurants, cuisines, dietary preferences",
    value: 12,
    requiredMemories: 8,
    currentMemories: 8,
    examples: ["Cuisine preferences", "Dietary restrictions", "Favorite restaurants"],
    unlocked: true,
  },
  {
    id: "health",
    name: "Health & Wellness",
    icon: Heart,
    description: "Fitness goals, health conditions, wellness routines",
    value: 85,
    requiredMemories: 15,
    currentMemories: 12,
    examples: ["Exercise habits", "Health goals", "Sleep patterns"],
    unlocked: false,
  },
  {
    id: "driving",
    name: "Driving Habits",
    icon: Car,
    description: "Commute patterns, vehicle preferences, travel frequency",
    value: 35,
    requiredMemories: 12,
    currentMemories: 5,
    examples: ["Daily commute", "Road trip preferences", "Vehicle type"],
    unlocked: false,
  },
  {
    id: "work",
    name: "Professional Life",
    icon: Briefcase,
    description: "Career goals, work preferences, industry insights",
    value: 45,
    requiredMemories: 10,
    currentMemories: 7,
    examples: ["Industry", "Work style", "Career aspirations"],
    unlocked: false,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Music,
    description: "Music, movies, shows, hobbies",
    value: 8,
    requiredMemories: 8,
    currentMemories: 8,
    examples: ["Music genres", "Streaming habits", "Hobby time"],
    unlocked: true,
  },
  {
    id: "travel",
    name: "Travel Patterns",
    icon: MapPin,
    description: "Destinations, travel style, vacation preferences",
    value: 28,
    requiredMemories: 10,
    currentMemories: 6,
    examples: ["Dream destinations", "Travel frequency", "Accommodation style"],
    unlocked: false,
  },
  {
    id: "fitness",
    name: "Fitness Data",
    icon: Activity,
    description: "Workout routines, activity levels, fitness goals",
    value: 42,
    requiredMemories: 12,
    currentMemories: 9,
    examples: ["Weekly workouts", "Fitness apps used", "Activity goals"],
    unlocked: false,
  },
];

export default function WorthAIPage() {
  const { authenticated, ready, login } = usePrivy();
  const [categories, setCategories] = useState<MemoryCategory[]>(memoryCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selling, setSelling] = useState(false);
  const [sold, setSold] = useState(false);

  const totalValue = categories
    .filter((c) => c.unlocked)
    .reduce((acc, c) => acc + c.value, 0);

  const potentialValue = categories.reduce((acc, c) => acc + c.value, 0);

  const handleAddMemories = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === categoryId && c.currentMemories < c.requiredMemories) {
          const newCurrent = Math.min(c.currentMemories + 2, c.requiredMemories);
          return {
            ...c,
            currentMemories: newCurrent,
            unlocked: newCurrent >= c.requiredMemories,
          };
        }
        return c;
      })
    );
  };

  const handleSell = async () => {
    setSelling(true);
    // Simulate blockchain transaction
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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 theme-worth">
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
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-6 money-glow">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-gray-900 mb-3">
              Worth AI
            </h1>
            <p className="text-gray-600 mb-8">
              Discover how much your data is worth. Sign in to start.
            </p>
            <button
              onClick={login}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              Sign In to Continue
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 theme-worth">
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
          <EvermindBadge size="sm" />
        </div>
      </header>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Value Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 mb-8 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-gray-500 text-sm mb-2">Your Data Value</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl font-bold text-gray-900">
                    ${(totalValue / 100).toFixed(2)}
                  </span>
                  <span className="text-emerald-500 font-medium">USDC</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Potential: ${(potentialValue / 100).toFixed(2)} USDC
                </p>
              </div>

              <div className="flex gap-4">
                <div className="text-center px-6 py-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">
                    {categories.filter((c) => c.unlocked).length}
                  </p>
                  <p className="text-xs text-gray-500">Categories Ready</p>
                </div>
                <div className="text-center px-6 py-4 bg-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600">
                    {categories.filter((c) => !c.unlocked).length}
                  </p>
                  <p className="text-xs text-gray-500">In Progress</p>
                </div>
              </div>

              <button
                onClick={() => setShowSellModal(true)}
                disabled={totalValue === 0}
                className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Sell My Data
              </button>
            </div>
          </motion.div>

          {/* Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl mb-8"
          >
            <TrendingUp className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Tip:</strong> Share more memories in each category to unlock their full value. The more context you provide, the more valuable your data becomes.
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className={`bg-white rounded-xl border p-5 transition-all cursor-pointer ${
                  selectedCategory === category.id
                    ? "border-emerald-500 shadow-lg"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-md"
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
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
                    <div className={`font-bold ${category.unlocked ? "text-emerald-600" : "text-gray-400"}`}>
                      ${(category.value / 100).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">USDC</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
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
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        category.unlocked ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                      style={{ width: `${(category.currentMemories / category.requiredMemories) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {selectedCategory === category.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Examples of valuable data:</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {category.examples.map((example) => (
                            <span key={example} className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-600">
                              {example}
                            </span>
                          ))}
                        </div>
                        {!category.unlocked && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddMemories(category.id);
                            }}
                            className="w-full py-2 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            Share More Memories (+2)
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

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
                    Transaction Complete!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    ${(totalValue / 100).toFixed(2)} USDC has been sent to your wallet.
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
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-gray-900">
                        Sell Your Data
                      </h2>
                      <p className="text-sm text-gray-500">Receive USDC to your wallet</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-500">Categories to sell</span>
                      <span className="font-medium">{categories.filter((c) => c.unlocked).length}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-500">Total memories</span>
                      <span className="font-medium">
                        {categories.filter((c) => c.unlocked).reduce((acc, c) => acc + c.currentMemories, 0)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 my-3" />
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">You'll receive</span>
                      <span className="text-xl font-bold text-emerald-600">
                        ${(totalValue / 100).toFixed(2)} USDC
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg mb-6">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      This is a demo. In production, your data would be encrypted and sold to verified data buyers.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleSell}
                      disabled={selling}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-70"
                    >
                      {selling ? "Processing..." : "Confirm Sale"}
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
