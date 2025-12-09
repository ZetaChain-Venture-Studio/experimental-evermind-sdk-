import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vault color palette - Deep forest green with gold accents
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Custom Vault colors
        vault: {
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
            950: "#052e16",
            deep: "#064E3B",
            darker: "#0D2818",
          },
          gold: {
            DEFAULT: "#D4AF37",
            light: "#E5C158",
            dark: "#B8942E",
          },
          steel: {
            DEFAULT: "#71717A",
            light: "#A1A1AA",
            dark: "#52525B",
          },
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "vault-door-open": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(-120deg)" },
        },
        "vault-dial-spin": {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(720deg)" },
          "50%": { transform: "rotate(360deg)" },
          "75%": { transform: "rotate(900deg)" },
          "100%": { transform: "rotate(540deg)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gold-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "seal-stamp": {
          "0%": { transform: "scale(1.5) rotate(-20deg)", opacity: "0" },
          "50%": { transform: "scale(1.1) rotate(5deg)", opacity: "0.8" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "breathing": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
        },
      },
      animation: {
        "vault-door-open": "vault-door-open 1.5s ease-in-out forwards",
        "vault-dial-spin": "vault-dial-spin 2s ease-in-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "gold-shimmer": "gold-shimmer 3s linear infinite",
        "seal-stamp": "seal-stamp 0.4s ease-out forwards",
        "breathing": "breathing 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
