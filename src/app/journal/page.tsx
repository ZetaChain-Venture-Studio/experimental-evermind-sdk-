"use client";

import { usePrivy } from "@/components/providers/privy-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Sparkles, Menu, X, Send, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSolace, MoodType } from "@/features/journal/use-solace";
import { cn } from "@/lib/utils";

const moodColors: Record<MoodType, string> = {
  joy: "bg-mood-joy",
  calm: "bg-mood-calm",
  sad: "bg-mood-sad",
  anxious: "bg-mood-anxious",
  angry: "bg-mood-angry",
  neutral: "bg-mood-neutral",
};

const moodLabels: Record<MoodType, string> = {
  joy: "Joyful",
  calm: "Calm",
  sad: "Sad",
  anxious: "Anxious",
  angry: "Frustrated",
  neutral: "Neutral",
};

export default function JournalPage() {
  const { authenticated, ready, logout, user } = usePrivy();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const {
    messages,
    isLoading,
    sendMessage,
    entries,
    moodStats,
    insights,
    currentStreak,
    totalCheckIns,
    hasEncryptionKey,
    generateEncryptionKey,
  } = useSolace();

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const message = inputValue;
    setInputValue("");
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
          <p className="text-muted-foreground font-light">Loading...</p>
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
        className="fixed top-4 right-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
      </Button>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-solace-lavender-400 to-solace-lavender-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl">Solace</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email?.address || "Guest"}
            </span>
            <Button variant="ghost" size="sm" onClick={logout} className="rounded-full">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4",
                  message.role === "user" && "justify-end"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-solace-lavender-400 to-solace-lavender-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "px-5 py-4 max-w-md",
                    message.role === "user"
                      ? "chat-bubble-user"
                      : "chat-bubble-assistant"
                  )}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  {message.detectedMood && message.detectedMood !== "neutral" && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
                      <div className={cn("w-2 h-2 rounded-full", moodColors[message.detectedMood])} />
                      <span className="text-xs opacity-80">
                        Feeling {moodLabels[message.detectedMood].toLowerCase()}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-solace-lavender-400 to-solace-lavender-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="chat-bubble-assistant px-5 py-4">
                  <div className="flex gap-1">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-border bg-background p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3 items-end">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share what's on your mind..."
                className="min-h-[56px] max-h-[200px] resize-none rounded-2xl border-border focus:border-primary"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="rounded-full h-14 w-14 flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Your conversations are private and help track your emotional patterns
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar - Insights */}
      <aside
        className={cn(
          "fixed md:relative inset-y-0 right-0 z-40 w-80 bg-background border-l border-border transition-transform duration-300 overflow-y-auto",
          sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 space-y-6">
          {/* Streak */}
          <div className="card-soft p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Check-in streak</span>
              <span className="text-2xl font-display">{currentStreak}</span>
            </div>
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2 flex-1 rounded-full",
                    i < currentStreak ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Mood Distribution */}
          <div>
            <h3 className="font-display text-lg mb-3">This week's moods</h3>
            <div className="space-y-3">
              {moodStats.slice(0, 4).map((stat) => (
                <div key={stat.mood} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{moodLabels[stat.mood]}</span>
                    <span>{stat.percentage}%</span>
                  </div>
                  <div className="mood-bar">
                    <div
                      className={cn("mood-bar-fill", moodColors[stat.mood])}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div>
            <h3 className="font-display text-lg mb-3">Insights</h3>
            <div className="space-y-3">
              {insights.map((insight) => (
                <div key={insight.id} className="insight-card">
                  <div className="flex items-start gap-3">
                    {insight.mood && (
                      <div className={cn("w-3 h-3 rounded-full mt-1", moodColors[insight.mood])} />
                    )}
                    <div>
                      <h4 className="text-sm font-medium mb-1">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent entries */}
          <div>
            <h3 className="font-display text-lg mb-3">Recent check-ins</h3>
            <div className="space-y-2">
              {entries.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className={cn("w-3 h-3 rounded-full", moodColors[entry.mood])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{entry.note}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
