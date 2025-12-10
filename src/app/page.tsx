"use client";

import { motion } from "framer-motion";
import { Heart, Brain, TrendingUp, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: MessageCircle,
    title: "Daily Check-ins",
    description: "Start each day with a gentle conversation about how you're feeling",
  },
  {
    icon: Brain,
    title: "Pattern Recognition",
    description: "Discover emotional patterns and triggers you might not notice yourself",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "See your emotional journey over time with insightful statistics",
  },
  {
    icon: Heart,
    title: "Judgment-Free Space",
    description: "Express yourself freely in a safe, private environment",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-solace-lavender-400 to-solace-lavender-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl">Solace</span>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="rounded-full">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Floating decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
            className="absolute top-0 left-0 w-64 h-64 rounded-full bg-solace-lavender-200/30 blur-3xl pointer-events-none"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute top-20 right-0 w-48 h-48 rounded-full bg-solace-sage-200/30 blur-3xl pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-solace-lavender-100 text-solace-lavender-600 text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Your safe space for self-reflection
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-display-xl text-foreground mb-6 relative"
          >
            A gentle companion for
            <br />
            <span className="text-primary">your mental wellness</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-10"
          >
            Solace helps you understand your emotions through daily conversations,
            track your mood patterns, and grow with personalized insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8 group">
                Begin Your Journey
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-display-lg text-foreground mb-4">
              How Solace supports you
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Like having a thoughtful friend who's always there to listen
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-soft p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample conversation */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-display-lg text-foreground mb-4">
              Conversations that matter
            </h2>
            <p className="text-muted-foreground text-lg">
              Gentle questions that help you explore your feelings
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-soft p-8 space-y-6"
          >
            {/* Assistant message */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-solace-lavender-400 to-solace-lavender-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="chat-bubble-assistant px-5 py-4 max-w-md">
                <p>Good morning! How are you feeling today? Take your time - there's no rush here.</p>
              </div>
            </div>

            {/* User message */}
            <div className="flex gap-4 justify-end">
              <div className="chat-bubble-user px-5 py-4 max-w-md">
                <p>I've been feeling a bit overwhelmed with work lately. It's hard to switch off.</p>
              </div>
            </div>

            {/* Assistant response */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-solace-lavender-400 to-solace-lavender-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="chat-bubble-assistant px-5 py-4 max-w-md">
                <p>That sounds really draining. You've mentioned work stress a few times this month. What do you think might help you create some boundaries?</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="gradient-calm rounded-3xl p-12">
            <h2 className="font-display text-display-md text-foreground mb-4">
              Ready to start your wellness journey?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Take the first step towards understanding yourself better
            </p>
            <Link href="/login">
              <Button size="lg" className="rounded-full px-10 group">
                Get Started Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-solace-lavender-400 to-solace-lavender-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg">Solace</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Solace. Your feelings matter.
          </p>
        </div>
      </footer>
    </div>
  );
}
