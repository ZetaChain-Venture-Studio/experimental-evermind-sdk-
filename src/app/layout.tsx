import type { Metadata } from "next";
import { Inter, Crimson_Pro, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PrivyAuthProvider } from "@/components/providers/privy-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solace - Your Gentle Mind Companion",
  description: "A safe space to explore your feelings with an AI companion that listens, understands, and helps you grow.",
  keywords: ["mental health", "mood tracking", "therapy", "AI companion", "wellness", "mindfulness"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${crimsonPro.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <PrivyAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster
              theme="light"
              toastOptions={{
                style: {
                  background: "white",
                  border: "1px solid hsl(30 15% 90%)",
                  color: "hsl(240 10% 25%)",
                },
              }}
            />
          </ThemeProvider>
        </PrivyAuthProvider>
      </body>
    </html>
  );
}
