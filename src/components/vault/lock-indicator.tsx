"use client";

import { Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LockIndicatorProps {
  encrypted: boolean;
  className?: string;
  showLabel?: boolean;
}

export function LockIndicator({
  encrypted,
  className,
  showLabel = true,
}: LockIndicatorProps) {
  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
        encrypted
          ? "bg-emerald-500/10 text-emerald-500"
          : "bg-amber-500/10 text-amber-500",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.div
        animate={encrypted ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {encrypted ? (
          <Lock className="w-4 h-4" />
        ) : (
          <Unlock className="w-4 h-4" />
        )}
      </motion.div>
      {showLabel && (
        <span className="text-xs font-medium">
          {encrypted ? "Encrypted" : "Not Encrypted"}
        </span>
      )}
    </motion.div>
  );
}
