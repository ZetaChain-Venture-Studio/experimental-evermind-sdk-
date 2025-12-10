"use client";

import { usePrivy } from "@/components/providers/privy-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Shield, Lock, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LockIndicator } from "@/components/vault/lock-indicator";
import { ChatWindow } from "@/components/journal/chat-window";
import { Sidebar } from "@/components/journal/sidebar";
import { useVault } from "@/features/journal/use-vault";
import { cn } from "@/lib/utils";

export default function JournalPage() {
  const { authenticated, ready, logout, user } = usePrivy();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    messages,
    isLoading,
    hasEncryptionKey,
    sendMessage,
    clearMessages,
    generateEncryptionKey,
    entries,
    patterns,
    analyzePatterns,
  } = useVault();

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  // Generate encryption key on mount if not present
  useEffect(() => {
    if (ready && authenticated && !hasEncryptionKey) {
      generateEncryptionKey();
    }
  }, [ready, authenticated, hasEncryptionKey, generateEncryptionKey]);

  const handleAnalyzePatterns = async () => {
    setIsAnalyzing(true);
    await analyzePatterns();
    setIsAnalyzing(false);
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-10 w-10 rounded-full border-2 border-vault-gold/40 border-t-vault-gold animate-spin" />
          <p className="text-muted-foreground font-light">Loading vault...</p>
        </motion.div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-40 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:block"
        )}
      >
        <Sidebar
          entries={entries}
          patterns={patterns}
          onAnalyzePatterns={handleAnalyzePatterns}
          isAnalyzing={isAnalyzing}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/30">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-vault-gold flex items-center justify-center">
                <Shield className="w-4 h-4 text-vault-green-darker" />
              </div>
              <span className="font-display text-xl tracking-tight hidden sm:inline">
                Vault
              </span>
            </Link>
            <LockIndicator encrypted={hasEncryptionKey} />
          </div>

          <div className="flex items-center gap-4">
            {user?.email?.address && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email.address}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </header>

        {/* Encryption gate */}
        {!hasEncryptionKey ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md"
            >
              <div className="w-20 h-20 rounded-full bg-vault-gold/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-vault-gold" />
              </div>
              <h2 className="font-display text-2xl mb-3">
                Generating Your Encryption Key
              </h2>
              <p className="text-muted-foreground mb-6">
                Your wallet is being set up to encrypt all your journal entries.
                This key is unique to you and never leaves your device.
              </p>
              <Button onClick={generateEncryptionKey}>
                Generate Encryption Key
              </Button>
            </motion.div>
          </div>
        ) : (
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            onClear={clearMessages}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
