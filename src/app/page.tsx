"use client";

import { motion } from "framer-motion";
import { Heart, DollarSign, Scale, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { EvermindBadge } from "@/components/evermind-badge";

const projects = [
  {
    id: "flirt-ai",
    title: "What Would You Do To Me?",
    subtitle: "Find Your AI Soulmate",
    description: "Ask one question, get answers from multiple AI personalities. Pick your perfect match.",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-50 to-rose-50",
    href: "/projects/flirt-ai",
    tags: ["Dating", "Fun", "Multi-Model"],
  },
  {
    id: "worth-ai",
    title: "Worth AI",
    subtitle: "Your Memories Have Value",
    description: "Discover how much your data is worth. Upload memories, see their market value in USDC.",
    icon: DollarSign,
    gradient: "from-emerald-500 to-green-500",
    bgGradient: "from-emerald-50 to-green-50",
    href: "/projects/worth-ai",
    tags: ["Data", "Value", "Crypto"],
  },
  {
    id: "legal-memory",
    title: "Legal Memory",
    subtitle: "Your Case, Your Control",
    description: "Own your legal case context. Share summaries with lawyers, save billable hours.",
    icon: Scale,
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-50 to-indigo-50",
    href: "/projects/legal-memory",
    tags: ["Legal", "Documents", "AI Summary"],
  },
  {
    id: "negotiator",
    title: "The Negotiator",
    subtitle: "AI Debate Arena",
    description: "Pick a topic. Watch two AI models debate both sides. Choose the argument you like.",
    icon: MessageSquare,
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
    href: "/projects/negotiator",
    tags: ["Debate", "Multi-Model", "Decision"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Mesh gradient background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-semibold">Evermind</span>
          </Link>
          <EvermindBadge size="sm" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI with Memory - Demo Showcase
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-display-xl text-gray-900 mb-6"
          >
            Experience the Power of
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Persistent AI Memory
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-4"
          >
            Explore demo applications powered by Evermind AI SDK.
            Each project showcases unique capabilities of AI with memory.
          </motion.p>
        </div>
      </section>

      {/* Project Cards */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl text-gray-900 mb-2">Select a Demo</h2>
            <p className="text-gray-500">Click on any project to explore</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Link href={project.href}>
                  <div className="project-card p-6 h-full cursor-pointer group">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <project.icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-gray-900 mb-1">
                          {project.title}
                        </h3>
                        <p className="text-sm font-medium text-gray-500">
                          {project.subtitle}
                        </p>
                      </div>

                      <p className="text-gray-600 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${project.bgGradient} text-gray-700`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 pt-3 group-hover:gap-3 transition-all">
                        <span>Launch Demo</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold">Evermind AI</span>
          </div>
          <p className="text-sm text-gray-500">
            Demo Showcase - AI with Persistent Memory
          </p>
        </div>
      </footer>
    </div>
  );
}
