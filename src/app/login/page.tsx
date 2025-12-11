"use client";

import { usePrivy, useLogin, useCreateWallet } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield } from "lucide-react";
import Link from "next/link";
import { EvermindBadge } from "@/components/evermind-badge";

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
        router.push("/");
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-500">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (authenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-500">Redirecting...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Gradient mesh background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      {/* Floating decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-indigo-200/30 blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-purple-200/30 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-semibold text-gray-900">Evermind</span>
          </Link>
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl p-10 text-center">
            {/* Welcoming icon */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center"
            >
              <Sparkles className="w-10 h-10 text-indigo-600" />
            </motion.div>

            <h1 className="font-display text-2xl font-semibold text-gray-900 mb-3">
              Welcome to Evermind
            </h1>
            <p className="text-gray-500 mb-8">
              Sign in to explore AI demos powered by persistent memory
            </p>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                "Connecting..."
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3 text-left">
                <Shield className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <p className="text-xs text-gray-500">
                  Secure authentication powered by Privy. Your data stays private.
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
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            ← Back to demos
          </Link>
        </motion.div>

        {/* Badge */}
        <div className="absolute bottom-8">
          <EvermindBadge variant="light" size="md" />
        </div>
      </div>
    </div>
  );
}
