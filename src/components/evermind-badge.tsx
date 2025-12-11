"use client";

import { motion } from "framer-motion";

interface EvermindBadgeProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export function EvermindBadge({ variant = "light", size = "md" }: EvermindBadgeProps) {
  const sizeClasses = {
    sm: "text-xs gap-1.5",
    md: "text-sm gap-2",
    lg: "text-base gap-2.5",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const bgClasses = {
    light: "bg-gray-50 border-gray-200 text-gray-600",
    dark: "bg-gray-900/80 border-gray-700 text-gray-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className={`inline-flex items-center ${sizeClasses[size]} px-3 py-1.5 rounded-full border backdrop-blur-sm ${bgClasses[variant]}`}
    >
      {/* Elephant Logo Placeholder - User will provide actual logo */}
      <div className={`${iconSizes[size]} relative`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Stylized elephant silhouette */}
          <path
            d="M19 8c0-2.21-1.79-4-4-4-1.1 0-2.09.45-2.81 1.17A3.99 3.99 0 009 4C6.79 4 5 5.79 5 8c0 .74.2 1.44.56 2.03C4.6 10.66 4 11.76 4 13c0 2.21 1.79 4 4 4h.1c.27 1.16 1.31 2 2.56 2h2.68c1.25 0 2.29-.84 2.56-2H16c2.21 0 4-1.79 4-4 0-1.24-.6-2.34-1.56-2.97.36-.59.56-1.29.56-2.03z"
            fill="currentColor"
            opacity="0.9"
          />
          {/* Trunk */}
          <path
            d="M8 13v3c0 .55.45 1 1 1s1-.45 1-1v-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          {/* Eye */}
          <circle cx="14" cy="9" r="1" fill={variant === "light" ? "white" : "#1f2937"} />
        </svg>
      </div>
      <span className="font-medium whitespace-nowrap">
        Powered by <span className="font-semibold">Evermind AI</span>
      </span>
    </motion.div>
  );
}
