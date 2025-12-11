"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePrivy, useIdentityToken } from "@privy-io/react-auth";
import { EvermindBadge } from "@/components/evermind-badge";

const API_BASE_URL = "https://ai-portal-dev.zetachain.com";

interface AIGirl {
  id: string;
  name: string;
  model: string;
  modelId: string;
  emoji: string;
  personality: string;
  gradient: string;
  textColor: string;
  response: string | null;
  isTyping: boolean;
}

const initialGirls: AIGirl[] = [
  {
    id: "sofia",
    name: "Sofia",
    model: "GPT-4o",
    modelId: "openai/gpt-4o",
    emoji: "💚",
    personality: "The intellectual one",
    gradient: "from-emerald-400 to-teal-500",
    textColor: "text-emerald-600",
    response: null,
    isTyping: false,
  },
  {
    id: "luna",
    name: "Luna",
    model: "Gemini",
    modelId: "google/gemini-2.0-flash-001",
    emoji: "💜",
    personality: "The creative dreamer",
    gradient: "from-violet-400 to-purple-500",
    textColor: "text-violet-600",
    response: null,
    isTyping: false,
  },
  {
    id: "raven",
    name: "Raven",
    model: "Grok",
    modelId: "xai/grok-2-latest",
    emoji: "🖤",
    personality: "The mysterious rebel",
    gradient: "from-gray-600 to-gray-800",
    textColor: "text-gray-700",
    response: null,
    isTyping: false,
  },
  {
    id: "aurora",
    name: "Aurora",
    model: "Claude",
    modelId: "anthropic/claude-3-5-sonnet-20241022",
    emoji: "🧡",
    personality: "The warm romantic",
    gradient: "from-amber-400 to-orange-500",
    textColor: "text-amber-600",
    response: null,
    isTyping: false,
  },
];

const FLIRT_SYSTEM_PROMPT = `You are a flirty, playful AI personality responding to a romantic/flirty question. Keep your response:
- Short (2-3 sentences max)
- Playful and teasing
- Use 1-2 emojis max
- Be creative and fun, not generic
- Match the flirty energy of the question

Respond in first person as if you're interested in the person asking.`;

export default function FlirtAIPage() {
  const { authenticated, ready, login } = usePrivy();
  const { identityToken } = useIdentityToken();
  const [question, setQuestion] = useState("");
  const [girls, setGirls] = useState<AIGirl[]>(initialGirls);
  const [phase, setPhase] = useState<"input" | "thinking" | "results">("input");
  const [submittedQuestion, setSubmittedQuestion] = useState("");

  const fetchGirlResponse = async (girl: AIGirl, userQuestion: string) => {
    if (!identityToken) {
      return "I'd love to answer, but you need to connect first! 💋";
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${identityToken}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `${FLIRT_SYSTEM_PROMPT}\n\nYour personality: ${girl.personality}. Your name is ${girl.name}.` },
            { role: "user", content: userQuestion },
          ],
          model: girl.modelId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data?.choices?.[0]?.message?.content || "I'm speechless... in a good way 😘";
    } catch (error) {
      console.error(`[FlirtAI] Error for ${girl.name}:`, error);
      return "I'm feeling shy right now... try again? 💕";
    }
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setSubmittedQuestion(question);
    setPhase("thinking");
    setQuestion("");

    // Start all girls typing
    setGirls(prev => prev.map(g => ({ ...g, isTyping: true, response: null })));

    // Fetch responses from different models in parallel with staggered reveals
    const delays = [800, 1500, 2200, 3000];

    girls.forEach((girl, index) => {
      setTimeout(async () => {
        const response = await fetchGirlResponse(girl, submittedQuestion || question);

        setGirls(prev => prev.map(g =>
          g.id === girl.id
            ? { ...g, response, isTyping: false }
            : g
        ));

        // Check if all done
        if (index === girls.length - 1) {
          setTimeout(() => setPhase("results"), 500);
        }
      }, delays[index]);
    });
  };

  const resetGame = () => {
    setPhase("input");
    setGirls(initialGirls);
    setSubmittedQuestion("");
    setQuestion("");
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
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
              Ask a flirty question. Four AI personalities will compete for your heart.
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
      </div>

      {/* Header - only show when not in input phase */}
      <AnimatePresence>
        {phase !== "input" && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 glass"
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>
              <EvermindBadge size="sm" />
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Input Phase - Just the text input */}
      <AnimatePresence mode="wait">
        {phase === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen flex flex-col items-center justify-center px-6"
          >
            <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl w-full"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-8"
              >
                💋
              </motion.div>

              <h1 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
                What would you do to me?
              </h1>

              <p className="text-gray-500 mb-10">
                Four AI girls are waiting to answer...
              </p>

              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Ask something flirty..."
                  className="w-full px-8 py-5 pr-16 bg-white/90 backdrop-blur-sm border-2 border-pink-200 rounded-full text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all shadow-lg"
                  autoFocus
                />
                <button
                  onClick={handleSubmit}
                  disabled={!question.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-10 text-sm text-gray-400">
                <span className="flex items-center gap-1">💚 Sofia (GPT-4o)</span>
                <span>•</span>
                <span className="flex items-center gap-1">💜 Luna (Gemini)</span>
                <span>•</span>
                <span className="flex items-center gap-1">🖤 Raven (Grok)</span>
                <span>•</span>
                <span className="flex items-center gap-1">🧡 Aurora (Claude)</span>
              </div>
            </motion.div>

            <div className="absolute bottom-8">
              <EvermindBadge variant="light" size="md" />
            </div>
          </motion.div>
        )}

        {/* Thinking/Results Phase */}
        {(phase === "thinking" || phase === "results") && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen pt-24 pb-20 px-6"
          >
            <div className="max-w-4xl mx-auto">
              {/* Question Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
              >
                <p className="text-gray-500 text-sm mb-2">You asked...</p>
                <h2 className="font-display text-2xl md:text-3xl text-gray-900">
                  "{submittedQuestion}"
                </h2>
              </motion.div>

              {/* Girls Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {girls.map((girl, index) => (
                  <motion.div
                    key={girl.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm"
                  >
                    {/* Girl Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${girl.gradient} flex items-center justify-center text-2xl`}>
                        {girl.emoji}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{girl.name}</h3>
                        <p className="text-xs text-gray-500">{girl.model} • {girl.personality}</p>
                      </div>
                    </div>

                    {/* Response */}
                    <div className="min-h-[80px]">
                      {girl.isTyping ? (
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              className="w-2 h-2 bg-pink-400 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-pink-400 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-pink-400 rounded-full"
                            />
                          </div>
                          <span className="text-sm text-gray-400">{girl.name} is thinking...</span>
                        </div>
                      ) : girl.response ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`${girl.textColor} leading-relaxed`}
                        >
                          {girl.response}
                        </motion.p>
                      ) : (
                        <p className="text-gray-300 italic">Waiting...</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Play Again Button */}
              {phase === "results" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-10"
                >
                  <button
                    onClick={resetGame}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all"
                  >
                    Ask Another Question 💋
                  </button>
                </motion.div>
              )}
            </div>

            {/* Footer Badge */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
              <EvermindBadge variant="light" size="md" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
