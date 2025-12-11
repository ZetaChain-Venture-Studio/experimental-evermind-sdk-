"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, Sparkles, ArrowLeft, Crown, Check } from "lucide-react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { EvermindBadge } from "@/components/evermind-badge";

interface AIGirl {
  id: string;
  name: string;
  model: string;
  avatar: string;
  personality: string;
  gradient: string;
  response: string | null;
  isTyping: boolean;
}

const aiGirls: AIGirl[] = [
  {
    id: "gpt",
    name: "Sofia",
    model: "GPT-4",
    avatar: "avatar-gpt",
    personality: "Intelligent & Witty",
    gradient: "from-emerald-400 to-teal-500",
    response: null,
    isTyping: false,
  },
  {
    id: "gemini",
    name: "Luna",
    model: "Gemini",
    avatar: "avatar-gemini",
    personality: "Creative & Playful",
    gradient: "from-blue-400 to-violet-500",
    response: null,
    isTyping: false,
  },
  {
    id: "grok",
    name: "Raven",
    model: "Grok",
    avatar: "avatar-grok",
    personality: "Bold & Mysterious",
    gradient: "from-gray-600 to-gray-800",
    response: null,
    isTyping: false,
  },
  {
    id: "claude",
    name: "Aurora",
    model: "Claude",
    avatar: "avatar-claude",
    personality: "Warm & Thoughtful",
    gradient: "from-amber-400 to-orange-500",
    response: null,
    isTyping: false,
  },
];

// Simulated responses for demo
const simulatedResponses: Record<string, string[]> = {
  gpt: [
    "Well, that's quite forward of you... I'd probably start by making you laugh until your cheeks hurt, then cook you the most amazing dinner you've ever had. After that? Let's just say I'm full of surprises... 😏",
    "Mmm, interesting question... I'd challenge you to a battle of wits first - nothing's more attractive than someone who can keep up. Once you've proven yourself? I might just show you my softer side... 💋",
    "I'd take you on an adventure you'd never forget. Start with a midnight rooftop picnic, end up dancing under the stars. What happens in between stays between us... ✨",
  ],
  gemini: [
    "Ooh, getting spicy! 🔥 I'd paint your portrait while you tell me your deepest secrets, then we'd get lost in a museum after hours. Romance is in the little moments, don't you think?",
    "First, I'd want to know what makes you tick... then I'd create a whole experience just for you. Personalized playlist, candlelit everything, and conversations that last until sunrise 🌅",
    "I'm the creative type, so... maybe we start with stargazing and end up writing poetry about each other? I promise to make every moment feel like a scene from your favorite movie 🎬",
  ],
  grok: [
    "Cut the small talk. I'd probably challenge you to something unexpected - maybe a late-night drive to nowhere, or a spontaneous trip to see the northern lights. Life's too short for boring dates. 🖤",
    "I don't do normal. I'd take you somewhere you've never been, show you things you've never seen. Fair warning: once you go dark side, you never go back... 😈",
    "Straight up? I'd match your energy and raise you. Whatever you're thinking, I'm thinking bigger. The question is... can you handle it? 🌙",
  ],
  claude: [
    "That's sweet of you to ask... I'd probably start with meaningful conversation over coffee, learn what lights up your eyes when you talk about your passions. True connection comes from understanding, and I find that incredibly romantic. 🧡",
    "I'd want to create something real with you. Maybe we volunteer together, cook a meal for friends, or just sit by a fire and share stories. The best relationships are built on genuine moments... 💫",
    "Honestly? I'd listen. Really listen. Then I'd remember every little thing you told me and surprise you with it later. Nothing says 'I care' like paying attention to the details... 🌸",
  ],
};

export default function FlirtAIPage() {
  const { authenticated, ready, login } = usePrivy();
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [girls, setGirls] = useState<AIGirl[]>(aiGirls);
  const [hasAsked, setHasAsked] = useState(false);
  const [selectedGirl, setSelectedGirl] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) {
      // Will show login prompt
    }
  }, [ready, authenticated]);

  const handleAsk = async () => {
    if (!question.trim() || hasAsked) return;

    setHasAsked(true);

    // Start typing animation for all girls
    setGirls((prev) =>
      prev.map((g) => ({ ...g, isTyping: true }))
    );

    // Simulate staggered responses
    const delays = [1500, 2200, 2800, 3500];

    girls.forEach((girl, index) => {
      setTimeout(() => {
        const responses = simulatedResponses[girl.id];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        setGirls((prev) =>
          prev.map((g) =>
            g.id === girl.id
              ? { ...g, response: randomResponse, isTyping: false }
              : g
          )
        );
      }, delays[index]);
    });
  };

  const handleSelect = (girlId: string) => {
    setSelectedGirl(girlId);
    setTimeout(() => setShowResult(true), 500);
  };

  const resetDemo = () => {
    setQuestion("");
    setGirls(aiGirls);
    setHasAsked(false);
    setSelectedGirl(null);
    setShowResult(false);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100">
        <div className="animate-pulse text-pink-500">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 theme-dating">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
        </div>

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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-gray-900 mb-3">
              What Would You Do To Me?
            </h1>
            <p className="text-gray-600 mb-8">
              Find your AI soulmate. Sign in to ask your burning question.
            </p>
            <button
              onClick={login}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              Sign In to Play
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 theme-dating">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-200/20 to-rose-200/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-gray-900">Flirt AI</span>
          </div>
          <EvermindBadge size="sm" />
        </div>
      </header>

      <main className="relative pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-display-lg text-gray-900 mb-2">
              What Would You Do To Me?
            </h1>
            <p className="text-gray-600">
              Ask one question. Four AI personalities will answer. Choose your favorite.
            </p>
          </motion.div>

          {/* Question Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Ask something flirty... e.g., 'What would you do on our first date?'"
                disabled={hasAsked}
                className="w-full px-6 py-4 pr-14 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleAsk}
                disabled={!question.trim() || hasAsked}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {hasAsked && (
              <button
                onClick={resetDemo}
                className="mt-4 mx-auto block text-sm text-pink-600 hover:text-pink-700 transition-colors"
              >
                Ask a different question
              </button>
            )}
          </motion.div>

          {/* AI Girls Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {girls.map((girl, index) => (
              <motion.div
                key={girl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
                  selectedGirl === girl.id
                    ? "border-pink-500 ring-2 ring-pink-500/20 shadow-lg"
                    : "border-pink-100 hover:border-pink-200 hover:shadow-md"
                }`}
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-full ${girl.avatar} flex items-center justify-center text-white font-bold text-lg`}>
                    {girl.name[0]}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-gray-900">{girl.name}</h3>
                    <p className="text-sm text-gray-500">{girl.model} • {girl.personality}</p>
                  </div>
                  {selectedGirl === girl.id && (
                    <div className="ml-auto w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Response Area */}
                <div className="min-h-[120px] flex items-start">
                  {!hasAsked ? (
                    <p className="text-gray-400 italic">Waiting for your question...</p>
                  ) : girl.isTyping ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                      </div>
                      <span className="text-sm text-gray-400">{girl.name} is thinking...</span>
                    </div>
                  ) : girl.response ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-700 leading-relaxed"
                    >
                      {girl.response}
                    </motion.p>
                  ) : null}
                </div>

                {/* Select Button */}
                {girl.response && !selectedGirl && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleSelect(girl.id)}
                    className={`mt-4 w-full py-3 rounded-xl bg-gradient-to-r ${girl.gradient} text-white font-medium hover:shadow-lg transition-all`}
                  >
                    Choose {girl.name}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Result Modal */}
          <AnimatePresence>
            {showResult && selectedGirl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowResult(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-6">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-gray-900 mb-2">
                    It's a Match!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    You've chosen <strong>{girls.find((g) => g.id === selectedGirl)?.name}</strong> as your AI soulmate!
                  </p>
                  <p className="text-sm text-gray-500 mb-8">
                    {girls.find((g) => g.id === selectedGirl)?.model} seems to be the right AI model for your vibe.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={resetDemo}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium hover:shadow-lg transition-all"
                    >
                      Play Again
                    </button>
                    <Link href="/">
                      <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all">
                        Back to Demos
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Badge */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <EvermindBadge variant="light" size="md" />
      </div>
    </div>
  );
}
