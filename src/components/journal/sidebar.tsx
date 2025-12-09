"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import type { VaultEntry, PatternInsight } from "@/features/journal/use-vault";

interface SidebarProps {
  entries: VaultEntry[];
  patterns: PatternInsight[];
  onEntryClick?: (entry: VaultEntry) => void;
  onAnalyzePatterns?: () => void;
  isAnalyzing?: boolean;
}

export function Sidebar({
  entries,
  patterns,
  onEntryClick,
  onAnalyzePatterns,
  isAnalyzing,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"entries" | "patterns">("entries");

  return (
    <div className="w-80 border-r border-border bg-card/30 flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("entries")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-colors",
            activeTab === "entries"
              ? "text-vault-gold border-b-2 border-vault-gold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Entries
        </button>
        <button
          onClick={() => setActiveTab("patterns")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-colors",
            activeTab === "patterns"
              ? "text-vault-gold border-b-2 border-vault-gold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <TrendingUp className="w-4 h-4" />
          Patterns
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === "entries" ? (
            <motion.div
              key="entries"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="p-4"
            >
              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No entries yet
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Start writing to create your first entry
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {entries.map((entry, index) => (
                    <motion.button
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onEntryClick?.(entry)}
                      className="w-full text-left p-3 rounded-lg border border-border bg-card/50 hover:bg-card hover:border-vault-gold/30 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-vault-gold font-mono">
                            {formatRelativeTime(entry.date)}
                          </p>
                          <p className="text-sm text-foreground mt-1 line-clamp-2">
                            {entry.preview}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="patterns"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-4"
            >
              {/* Analyze button */}
              <Button
                variant="outline"
                onClick={onAnalyzePatterns}
                disabled={isAnalyzing}
                className="w-full mb-4"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze Patterns
                  </>
                )}
              </Button>

              {patterns.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No patterns detected yet
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Write more entries to discover insights
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patterns.map((pattern, index) => (
                    <motion.div
                      key={pattern.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-border bg-card/50"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            pattern.trend === "up"
                              ? "bg-amber-500/10 text-amber-500"
                              : pattern.trend === "down"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-vault-steel/10 text-vault-steel"
                          )}
                        >
                          {pattern.trend === "up" ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : pattern.trend === "down" ? (
                            <ArrowDownRight className="w-4 h-4" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{pattern.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {pattern.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* On this day section */}
      <div className="p-4 border-t border-border bg-vault-green-deep/30">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Calendar className="w-3 h-3" />
          On this day
        </div>
        <p className="text-sm text-muted-foreground/60 italic">
          No entries from previous years yet
        </p>
      </div>
    </div>
  );
}
