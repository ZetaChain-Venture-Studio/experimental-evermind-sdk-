"use client";

import { usePrivy, useLogin, useCreateWallet } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { authenticated, ready, user } = usePrivy();
  const { login } = useLogin();
  const { createWallet } = useCreateWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // After login, create embedded wallet if user doesn't have one (needed for identity token)
  useEffect(() => {
    async function ensureWallet() {
      if (ready && authenticated && user) {
        const hasWallet = user.linkedAccounts?.some(
          (account) => account.type === "wallet"
        );
        if (!hasWallet) {
          console.log("[Login] Creating embedded wallet for identity token...");
          try {
            await createWallet();
            console.log("[Login] Wallet created successfully");
          } catch (e) {
            console.error("[Login] Failed to create wallet:", e);
          }
        }
        router.push("/journal");
      }
    }
    ensureWallet();
  }, [ready, authenticated, user, createWallet, router]);

  const handleLogin = () => {
    setIsLoading(true);
    login();
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-solace-lavender-400 to-solace-lavender-600 flex items-center justify-center animate-breathing">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-muted-foreground font-light">Preparing your space...</p>
        </motion.div>
      </div>
    );
  }

  if (authenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-solace-lavender-400 to-solace-lavender-600 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <p className="text-muted-foreground font-light">Welcome back...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Soft gradient background */}
      <div className="absolute inset-0 gradient-calm pointer-events-none" />

      {/* Floating decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-solace-lavender-200/40 blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-solace-sage-200/40 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-solace-lavender-400 to-solace-lavender-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl">Solace</span>
          </Link>
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="card-soft p-10 text-center">
            {/* Welcoming icon */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-solace-lavender-100 to-solace-sage-100 flex items-center justify-center"
            >
              <Heart className="w-10 h-10 text-primary" />
            </motion.div>

            <h1 className="font-display text-2xl mb-3">
              Welcome to your safe space
            </h1>
            <p className="text-muted-foreground font-light mb-8">
              A gentle place to explore your thoughts and feelings
            </p>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full rounded-full group"
              size="lg"
            >
              {isLoading ? (
                "Preparing..."
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <div className="mt-8 p-4 rounded-2xl bg-muted/50">
              <div className="flex items-center gap-3 text-left">
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Your conversations are private. We don't store or share your personal reflections.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="text-sm text-muted-foreground font-light hover:text-foreground transition-colors duration-300"
          >
            ← Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
