"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  ArrowLeft,
  Send,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  RefreshCw,
  Trophy,
  Swords,
  Check,
} from "lucide-react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { EvermindBadge } from "@/components/evermind-badge";

interface Debater {
  id: string;
  name: string;
  model: string;
  position: "for" | "against";
  avatar: string;
  color: string;
  argument: string | null;
  isTyping: boolean;
}

const debateTopics = [
  "Should AI be regulated by governments?",
  "Is remote work better than office work?",
  "Should social media require age verification?",
  "Is cryptocurrency the future of money?",
  "Should college education be free?",
  "Is nuclear energy the solution to climate change?",
];

const simulatedArguments: Record<string, { for: string; against: string }> = {
  default: {
    for: `I firmly believe in this position. Here's why:

**Evidence-based reasoning**: Studies consistently show positive outcomes when we embrace this approach. The data speaks for itself - improved efficiency, better outcomes, and stronger community support.

**Historical precedent**: Throughout history, similar decisions have led to progress and innovation. We should learn from these successes.

**Ethical considerations**: This aligns with our core values of fairness, progress, and collective wellbeing. It's not just practical - it's the right thing to do.

The time for action is now. Let's move forward together.`,
    against: `I respectfully but strongly disagree. Consider these points:

**Unintended consequences**: While the intentions may be good, the practical implications could cause significant harm. We've seen this pattern before.

**Economic impact**: The costs - both direct and indirect - would be substantial. Who bears this burden? Often those least able to afford it.

**Personal freedom**: This approach fundamentally restricts individual choice and autonomy. In a free society, we must be cautious about such measures.

We should explore alternative solutions that achieve similar goals without these drawbacks.`,
  },
};

export default function NegotiatorPage() {
  const { authenticated, ready, login } = usePrivy();
  const [topic, setTopic] = useState("");
  const [debaters, setDebaters] = useState<Debater[]>([
    {
      id: "gpt",
      name: "GPT-4",
      model: "OpenAI",
      position: "for",
      avatar: "avatar-gpt",
      color: "emerald",
      argument: null,
      isTyping: false,
    },
    {
      id: "gemini",
      name: "Gemini",
      model: "Google",
      position: "against",
      avatar: "avatar-gemini",
      color: "blue",
      argument: null,
      isTyping: false,
    },
  ]);
  const [hasDebated, setHasDebated] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleStartDebate = async () => {
    if (!topic.trim()) return;

    setHasDebated(true);
    setDebaters((prev) => prev.map((d) => ({ ...d, isTyping: true })));

    // Simulate GPT-4 response
    setTimeout(() => {
      setDebaters((prev) =>
        prev.map((d) =>
          d.id === "gpt"
            ? { ...d, argument: simulatedArguments.default.for, isTyping: false }
            : d
        )
      );
    }, 1500);

    // Simulate Gemini response
    setTimeout(() => {
      setDebaters((prev) =>
        prev.map((d) =>
          d.id === "gemini"
            ? { ...d, argument: simulatedArguments.default.against, isTyping: false }
            : d
        )
      );
    }, 2500);
  };

  const handleSelectWinner = (debaterId: string) => {
    setSelectedWinner(debaterId);
    setTimeout(() => setShowResult(true), 500);
  };

  const resetDebate = () => {
    setTopic("");
    setDebaters((prev) =>
      prev.map((d) => ({ ...d, argument: null, isTyping: false }))
    );
    setHasDebated(false);
    setSelectedWinner(null);
    setShowResult(false);
  };

  const selectRandomTopic = () => {
    const randomTopic = debateTopics[Math.floor(Math.random() * debateTopics.length)];
    setTopic(randomTopic);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-violet-500">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 theme-negotiator">
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
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
              <Swords className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-gray-900 mb-3">
              The Negotiator
            </h1>
            <p className="text-gray-600 mb-8">
              Watch AI models debate. Pick the argument you like.
            </p>
            <button
              onClick={login}
              className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              Sign In to Start
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 theme-negotiator">
      {/* Ambient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl debate-pulse-left" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl debate-pulse-right" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Swords className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-gray-900">The Negotiator</span>
          </div>
          <EvermindBadge size="sm" />
        </div>
      </header>

      <main className="relative pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-display-lg text-gray-900 mb-2">
              AI Debate Arena
            </h1>
            <p className="text-gray-600">
              Enter a topic. Two AI models will debate both sides. Choose your winner.
            </p>
          </motion.div>

          {/* Topic Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStartDebate()}
                placeholder="Enter a debate topic... e.g., 'Should AI be regulated?'"
                disabled={hasDebated}
                className="w-full px-6 py-4 pr-28 bg-white/80 backdrop-blur-sm border border-violet-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                {!hasDebated && (
                  <button
                    onClick={selectRandomTopic}
                    className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                    title="Random topic"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleStartDebate}
                  disabled={!topic.trim() || hasDebated}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  Debate
                </button>
              </div>
            </div>
            {hasDebated && (
              <button
                onClick={resetDebate}
                className="mt-4 mx-auto block text-sm text-violet-600 hover:text-violet-700 transition-colors"
              >
                Start a new debate
              </button>
            )}
          </motion.div>

          {/* Debate Arena */}
          <div className="grid md:grid-cols-2 gap-6">
            {debaters.map((debater, index) => (
              <motion.div
                key={debater.id}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 ${
                  selectedWinner === debater.id
                    ? "border-violet-500 ring-4 ring-violet-500/20 shadow-xl"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                {/* Position Badge */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  debater.position === "for"
                    ? "bg-emerald-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {debater.position === "for" ? "For" : "Against"}
                </div>

                {/* Header */}
                <div className="flex items-center gap-4 p-5 border-b border-gray-100">
                  <div className={`w-12 h-12 rounded-xl ${debater.avatar} flex items-center justify-center text-white font-bold`}>
                    {debater.name[0]}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-gray-900">{debater.name}</h3>
                    <p className="text-sm text-gray-500">{debater.model}</p>
                  </div>
                  {selectedWinner === debater.id && (
                    <div className="ml-auto w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Argument Area */}
                <div className="p-5 min-h-[300px]">
                  {!hasDebated ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400 italic text-center">
                        Waiting for the debate to begin...
                      </p>
                    </div>
                  ) : debater.isTyping ? (
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                      </div>
                      <span className="text-sm text-gray-400">Crafting argument...</span>
                    </div>
                  ) : debater.argument ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="prose prose-gray prose-sm max-w-none"
                    >
                      {debater.argument.split("\n\n").map((para, i) => {
                        if (para.startsWith("**") && para.includes("**:")) {
                          const [title, ...rest] = para.split("**:");
                          return (
                            <p key={i} className="text-gray-700 mb-3">
                              <strong className="text-gray-900">{title.replace(/\*\*/g, "")}:</strong>
                              {rest.join("")}
                            </p>
                          );
                        }
                        return (
                          <p key={i} className="text-gray-700 mb-3">{para}</p>
                        );
                      })}
                    </motion.div>
                  ) : null}
                </div>

                {/* Vote Button */}
                {debater.argument && !selectedWinner && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 border-t border-gray-100"
                  >
                    <button
                      onClick={() => handleSelectWinner(debater.id)}
                      className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        debater.position === "for"
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      <ThumbsUp className="w-5 h-5" />
                      This argument wins
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* VS Indicator */}
          {hasDebated && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-violet-200 flex items-center justify-center">
                <span className="font-display font-bold text-violet-600 text-lg">VS</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && selectedWinner && (
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
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-gray-900 mb-2">
                Winner Selected!
              </h2>
              <p className="text-gray-600 mb-2">
                You chose <strong>{debaters.find((d) => d.id === selectedWinner)?.name}</strong>'s argument
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Position: <span className={`font-medium ${
                  debaters.find((d) => d.id === selectedWinner)?.position === "for"
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}>
                  {debaters.find((d) => d.id === selectedWinner)?.position === "for" ? "For" : "Against"}
                </span>
              </p>
              <div className="bg-violet-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-violet-700">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Different AI models excel at different types of reasoning.
                  Your preference might indicate which model aligns better with your thinking style.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={resetDebate}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
                >
                  New Debate
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

      {/* Footer Badge */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <EvermindBadge variant="light" size="md" />
      </div>
    </div>
  );
}
