"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Trophy,
  Swords,
  Check,
  ThumbsUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePrivy, useIdentityToken } from "@privy-io/react-auth";
import { EvermindBadge } from "@/components/evermind-badge";

const API_BASE_URL = "https://ai-portal-dev.zetachain.com";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  emoji: string;
  color: string;
}

const availableModels: AIModel[] = [
  { id: "gpt4o", name: "GPT-4o", provider: "OpenAI", modelId: "openai/gpt-4o", emoji: "💚", color: "emerald" },
  { id: "claude", name: "Claude 3.5", provider: "Anthropic", modelId: "anthropic/claude-3-5-sonnet-20241022", emoji: "🧡", color: "orange" },
  { id: "gemini", name: "Gemini 2.0", provider: "Google", modelId: "google/gemini-2.0-flash-001", emoji: "💜", color: "violet" },
  { id: "grok", name: "Grok 2", provider: "xAI", modelId: "xai/grok-2-latest", emoji: "🖤", color: "gray" },
];

const debateTopics = [
  "Should AI be regulated by governments?",
  "Is remote work better than office work?",
  "Should social media require age verification?",
  "Is cryptocurrency the future of money?",
  "Should college education be free?",
  "Is nuclear energy the solution to climate change?",
  "Should voting be mandatory?",
  "Is universal basic income a good idea?",
];

interface Debater {
  position: "for" | "against";
  model: AIModel;
  argument: string | null;
  isTyping: boolean;
}

export default function NegotiatorPage() {
  const { authenticated, ready, login } = usePrivy();
  const { identityToken } = useIdentityToken();
  const [topic, setTopic] = useState("");
  const [forModel, setForModel] = useState<AIModel>(availableModels[0]);
  const [againstModel, setAgainstModel] = useState<AIModel>(availableModels[1]);
  const [showForDropdown, setShowForDropdown] = useState(false);
  const [showAgainstDropdown, setShowAgainstDropdown] = useState(false);
  const [debaters, setDebaters] = useState<Debater[]>([
    { position: "for", model: availableModels[0], argument: null, isTyping: false },
    { position: "against", model: availableModels[1], argument: null, isTyping: false },
  ]);
  const [hasDebated, setHasDebated] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<"for" | "against" | null>(null);
  const [showResult, setShowResult] = useState(false);

  const fetchArgument = async (model: AIModel, position: "for" | "against", debateTopic: string): Promise<string> => {
    if (!identityToken) {
      return position === "for"
        ? "I strongly support this position! The benefits are clear and the evidence overwhelming. We should embrace this opportunity for progress."
        : "I must respectfully disagree. The risks and unintended consequences outweigh the potential benefits. We need a more cautious approach.";
    }

    const systemPrompt = `You are an expert debater arguing ${position.toUpperCase()} the following topic: "${debateTopic}"

Your task:
- Make a compelling, well-structured argument (3-4 paragraphs)
- Use specific examples and reasoning
- Be persuasive but not aggressive
- Format with **bold** for key points

Remember: You are arguing ${position.toUpperCase()} this topic, regardless of your personal views.`;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${identityToken}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Please argue ${position.toUpperCase()} the topic: "${debateTopic}"` },
          ],
          model: model.modelId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data?.choices?.[0]?.message?.content || "I couldn't formulate my argument at this time.";
    } catch (error) {
      console.error(`[Negotiator] Error for ${model.name}:`, error);
      return position === "for"
        ? "I strongly support this position! The benefits are clear and the evidence overwhelming. Progress requires bold action."
        : "I must respectfully disagree. The risks and unintended consequences outweigh the potential benefits. Caution is wisdom.";
    }
  };

  const handleStartDebate = async () => {
    if (!topic.trim()) return;

    setHasDebated(true);
    setDebaters([
      { position: "for", model: forModel, argument: null, isTyping: true },
      { position: "against", model: againstModel, argument: null, isTyping: true },
    ]);

    // Fetch both arguments in parallel
    const [forArg, againstArg] = await Promise.all([
      fetchArgument(forModel, "for", topic),
      fetchArgument(againstModel, "against", topic),
    ]);

    // Update with staggered reveal
    setTimeout(() => {
      setDebaters(prev => prev.map(d =>
        d.position === "for" ? { ...d, argument: forArg, isTyping: false } : d
      ));
    }, 500);

    setTimeout(() => {
      setDebaters(prev => prev.map(d =>
        d.position === "against" ? { ...d, argument: againstArg, isTyping: false } : d
      ));
    }, 1500);
  };

  const handleSelectWinner = (position: "for" | "against") => {
    setSelectedWinner(position);
    setTimeout(() => setShowResult(true), 500);
  };

  const resetDebate = () => {
    setTopic("");
    setDebaters([
      { position: "for", model: forModel, argument: null, isTyping: false },
      { position: "against", model: againstModel, argument: null, isTyping: false },
    ]);
    setHasDebated(false);
    setSelectedWinner(null);
    setShowResult(false);
  };

  const selectRandomTopic = () => {
    const randomTopic = debateTopics[Math.floor(Math.random() * debateTopics.length)];
    setTopic(randomTopic);
  };

  const selectModel = (model: AIModel, side: "for" | "against") => {
    if (side === "for") {
      setForModel(model);
      setShowForDropdown(false);
    } else {
      setAgainstModel(model);
      setShowAgainstDropdown(false);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
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
              Pick your fighters. Watch AI models debate. Choose the winner.
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      {/* Ambient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-red-200/20 rounded-full blur-3xl" />
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
            className="text-center mb-6"
          >
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
              AI Debate Arena
            </h1>
            <p className="text-gray-600">
              Choose your fighters, enter a topic, and watch them battle it out!
            </p>
          </motion.div>

          {/* Model Selection */}
          {!hasDebated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8"
            >
              {/* FOR Model Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowForDropdown(!showForDropdown)}
                  className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl hover:border-emerald-300 transition-colors"
                >
                  <span className="text-2xl">{forModel.emoji}</span>
                  <div className="text-left">
                    <p className="text-xs text-emerald-600 font-medium uppercase">For</p>
                    <p className="font-semibold text-gray-900">{forModel.name}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {showForDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10 w-56"
                    >
                      {availableModels.map(model => (
                        <button
                          key={model.id}
                          onClick={() => selectModel(model, "for")}
                          disabled={model.id === againstModel.id}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                            model.id === forModel.id ? "bg-emerald-50" : ""
                          } ${model.id === againstModel.id ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                          <span className="text-xl">{model.emoji}</span>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">{model.name}</p>
                            <p className="text-xs text-gray-500">{model.provider}</p>
                          </div>
                          {model.id === forModel.id && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-2xl font-bold text-violet-400">VS</div>

              {/* AGAINST Model Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowAgainstDropdown(!showAgainstDropdown)}
                  className="flex items-center gap-3 px-5 py-3 bg-red-50 border-2 border-red-200 rounded-xl hover:border-red-300 transition-colors"
                >
                  <span className="text-2xl">{againstModel.emoji}</span>
                  <div className="text-left">
                    <p className="text-xs text-red-600 font-medium uppercase">Against</p>
                    <p className="font-semibold text-gray-900">{againstModel.name}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {showAgainstDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10 w-56"
                    >
                      {availableModels.map(model => (
                        <button
                          key={model.id}
                          onClick={() => selectModel(model, "against")}
                          disabled={model.id === forModel.id}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                            model.id === againstModel.id ? "bg-red-50" : ""
                          } ${model.id === forModel.id ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                          <span className="text-xl">{model.emoji}</span>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">{model.name}</p>
                            <p className="text-xs text-gray-500">{model.provider}</p>
                          </div>
                          {model.id === againstModel.id && <Check className="w-4 h-4 text-red-500 ml-auto" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Topic Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStartDebate()}
                placeholder="Enter a debate topic..."
                disabled={hasDebated}
                className="w-full px-6 py-4 pr-32 bg-white/80 backdrop-blur-sm border border-violet-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  Fight!
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
          <div className="grid md:grid-cols-2 gap-6 relative">
            {debaters.map((debater, index) => (
              <motion.div
                key={debater.position}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 ${
                  selectedWinner === debater.position
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
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                    debater.position === "for" ? "from-emerald-400 to-emerald-600" : "from-red-400 to-red-600"
                  } flex items-center justify-center text-2xl`}>
                    {debater.model.emoji}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-gray-900 text-lg">{debater.model.name}</h3>
                    <p className="text-sm text-gray-500">{debater.model.provider}</p>
                  </div>
                  {selectedWinner === debater.position && (
                    <div className="ml-auto w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Argument Area */}
                <div className="p-5 min-h-[280px]">
                  {!hasDebated ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400 italic text-center">
                        Waiting for the battle to begin...
                      </p>
                    </div>
                  ) : debater.isTyping ? (
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className={`w-2 h-2 rounded-full ${debater.position === "for" ? "bg-emerald-400" : "bg-red-400"}`}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className={`w-2 h-2 rounded-full ${debater.position === "for" ? "bg-emerald-400" : "bg-red-400"}`}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className={`w-2 h-2 rounded-full ${debater.position === "for" ? "bg-emerald-400" : "bg-red-400"}`}
                        />
                      </div>
                      <span className="text-sm text-gray-400">{debater.model.name} is thinking...</span>
                    </div>
                  ) : debater.argument ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="prose prose-gray prose-sm max-w-none"
                    >
                      {debater.argument.split("\n\n").map((para, i) => {
                        // Handle bold text
                        const formattedPara = para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                        return (
                          <p
                            key={i}
                            className="text-gray-700 mb-3 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formattedPara }}
                          />
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
                      onClick={() => handleSelectWinner(debater.position)}
                      className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        debater.position === "for"
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      <ThumbsUp className="w-5 h-5" />
                      {debater.model.name} Wins!
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* VS Indicator */}
            {hasDebated && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-white shadow-xl border-2 border-violet-200 flex items-center justify-center"
                >
                  <span className="font-display font-bold text-violet-600 text-lg">VS</span>
                </motion.div>
              </div>
            )}
          </div>
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
                {debaters.find(d => d.position === selectedWinner)?.model.name} Wins!
              </h2>
              <p className="text-gray-600 mb-6">
                The <span className={`font-medium ${selectedWinner === "for" ? "text-emerald-600" : "text-red-600"}`}>
                  {selectedWinner === "for" ? "FOR" : "AGAINST"}
                </span> argument was more convincing to you.
              </p>
              <div className="bg-violet-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-violet-700">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Different AI models have unique reasoning styles. Your choice reveals which approach resonates with you!
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={resetDebate}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
                >
                  New Battle
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
