"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock, Brain, Calendar, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-vault-green-deep/50 to-background pointer-events-none" />

      {/* Animated vault door in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <div className="w-[600px] h-[600px] rounded-full border-[20px] border-vault-gold/20" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-vault-gold flex items-center justify-center">
                <Shield className="w-5 h-5 text-vault-green-darker" />
              </div>
              <span className="font-display text-2xl tracking-tight">Vault</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/login">
              <Button variant="outline" size="sm">
                Open Your Vault
              </Button>
            </Link>
          </motion.div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center px-6 pt-20 pb-32 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Vault icon */}
            <motion.div
              className="mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-br from-vault-gold to-vault-gold-dark flex items-center justify-center shadow-2xl shadow-vault-gold/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Lock className="w-12 h-12 text-vault-green-darker" />
            </motion.div>

            <h1 className="font-display text-display-xl mb-6">
              <span className="gold-shimmer">The only AI</span>
              <br />
              that can't betray you
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-light mb-12 max-w-xl mx-auto">
              An encrypted journal that remembers everything and tells no one.
            </p>

            <Link href="/login">
              <Button size="lg" className="group">
                Open Your Vault
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-4xl mx-auto"
          >
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="Remembers Everything"
              description="Never forgets what you shared. Your AI companion learns and grows with you."
              delay={0.1}
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Detects Patterns"
              description={`"You've mentioned work stress 5x this week." Gentle insights from your entries.`}
              delay={0.2}
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8" />}
              title="Resurfaces Meaning"
              description={`"1 year ago today, you wrote..." Anniversaries of your growth.`}
              delay={0.3}
            />
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-32 max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-display-md mb-8">
              True privacy, by design
            </h2>

            <div className="grid grid-cols-2 gap-8 p-8 rounded-2xl bg-card/50 border border-border">
              <div className="text-left">
                <h3 className="font-medium text-vault-gold mb-4">Your Device</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Your encrypted journal entries
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Your encryption key (wallet)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Your memories & patterns
                  </p>
                </div>
              </div>

              <div className="text-left">
                <h3 className="font-medium text-vault-steel mb-4">Our Servers</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-vault-steel" />
                    Nothing to store
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-vault-steel" />
                    Nothing to subpoena
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-vault-steel" />
                    Nothing to breach
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-32 text-center"
          >
            <p className="text-lg text-muted-foreground mb-6 font-light">
              Start writing what you can't say out loud.
            </p>
            <Link href="/login">
              <Button size="lg" className="group">
                Open Your Vault
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-muted-foreground">
          <p>Built with @reverbia/sdk</p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 + delay }}
      className="p-6 rounded-xl bg-card/50 border border-border hover:border-vault-gold/30 transition-colors"
    >
      <div className="w-14 h-14 rounded-full bg-vault-gold/10 text-vault-gold flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-display text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
