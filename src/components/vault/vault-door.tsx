"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VaultDoorProps {
  isOpen: boolean;
  onOpen?: () => void;
  className?: string;
}

export function VaultDoor({ isOpen, onOpen, className }: VaultDoorProps) {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    if (!isOpen && !isSpinning) {
      setIsSpinning(true);
      setTimeout(() => {
        onOpen?.();
      }, 2000);
    }
  };

  return (
    <div className={cn("relative perspective-[1000px]", className)}>
      <motion.div
        className="relative w-64 h-64 md:w-80 md:h-80"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Vault Door Frame */}
        <div className="absolute inset-0 rounded-full border-8 border-vault-steel bg-vault-green-darker shadow-2xl">
          {/* Inner ring */}
          <div className="absolute inset-4 rounded-full border-4 border-vault-steel-dark bg-gradient-to-br from-vault-green-deep to-vault-green-darker">
            {/* Dial markings */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 bg-vault-gold"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 30}deg) translateY(-140%) translateX(-50%)`,
                  transformOrigin: "center bottom",
                }}
              />
            ))}

            {/* Center dial */}
            <motion.div
              className={cn(
                "absolute inset-8 md:inset-12 rounded-full bg-gradient-to-br from-vault-steel to-vault-steel-dark",
                "border-4 border-vault-gold shadow-inner cursor-pointer",
                "flex items-center justify-center"
              )}
              animate={isSpinning ? { rotate: [0, 720, 360, 900, 540] } : {}}
              transition={{ duration: 2, ease: "easeInOut" }}
              onClick={handleClick}
            >
              {/* Dial handle */}
              <div className="w-4 h-16 md:w-5 md:h-20 bg-vault-gold rounded-full shadow-lg" />

              {/* Center emblem */}
              <div className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full bg-vault-gold flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 md:w-6 md:h-6 text-vault-green-darker"
                  fill="currentColor"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
              </div>
            </motion.div>

            {/* Lock indicators */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isSpinning || isOpen ? "bg-emerald-500" : "bg-vault-steel"
                  )}
                  animate={
                    isSpinning
                      ? {
                          backgroundColor: ["#71717A", "#22c55e"],
                          transition: { delay: i * 0.3 + 0.5 },
                        }
                      : {}
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Vault door panel (opens) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full bg-vault-green-deep"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -120 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Click hint */}
      {!isOpen && !isSpinning && (
        <motion.p
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Click the dial to open
        </motion.p>
      )}
    </div>
  );
}
