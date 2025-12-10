"use client";

import { usePrivy } from "@/components/providers/privy-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Lock } from "lucide-react";
import Link from "next/link";
import { VaultDoor } from "@/components/vault/vault-door";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { login, authenticated, ready } = usePrivy();
  const router = useRouter();
  const [vaultOpening, setVaultOpening] = useState(false);

  useEffect(() => {
    if (ready && authenticated) {
      setVaultOpening(true);
      setTimeout(() => {
        router.push("/journal");
      }, 1500);
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-10 w-10 rounded-full border-2 border-vault-gold/40 border-t-vault-gold animate-spin" />
          <p className="text-muted-foreground font-light">Initializing vault...</p>
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
          className="flex flex-col items-center gap-8"
        >
          <VaultDoor isOpen={vaultOpening} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground font-light"
          >
            Opening your vault...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-vault-green-deep/30 to-transparent pointer-events-none" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-vault-gold flex items-center justify-center">
              <Shield className="w-5 h-5 text-vault-green-darker" />
            </div>
            <span className="font-display text-2xl tracking-tight">Vault</span>
          </Link>
        </motion.div>

        {/* Vault Door Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-8 border-vault-steel bg-vault-green-darker shadow-2xl mx-auto">
            <div className="absolute inset-4 rounded-full border-4 border-vault-steel-dark bg-gradient-to-br from-vault-green-deep to-vault-green-darker flex items-center justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-vault-steel to-vault-steel-dark border-4 border-vault-gold flex items-center justify-center">
                <Lock className="w-8 h-8 md:w-10 md:h-10 text-vault-gold" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-sm"
        >
          <div className="p-8 text-center bg-card/50 border border-border/40 rounded-2xl backdrop-blur-sm">
            <h1 className="font-display text-2xl tracking-tight mb-3">
              Open Your Vault
            </h1>
            <p className="text-muted-foreground font-light mb-8">
              Sign in with your email to generate your encryption key
            </p>

            <Button
              onClick={login}
              className="w-full group"
              size="lg"
            >
              Sign In
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <div className="mt-8 p-4 rounded-lg bg-vault-green-deep/50 border border-vault-gold/10">
              <p className="text-xs text-muted-foreground font-light">
                Your email creates a unique wallet that encrypts all your journal entries.
                Only you can read them.
              </p>
            </div>

            <p className="text-xs text-muted-foreground/60 font-light mt-6">
              By signing in, you agree to our{" "}
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              {" "}and{" "}
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </p>
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
            Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
