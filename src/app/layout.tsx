import type { Metadata } from "next";
import { Source_Serif_4, Merriweather, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PrivyAuthProvider } from "@/components/providers/privy-provider";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vault - The Only AI That Can't Betray You",
  description: "An encrypted AI journal that remembers everything and tells no one. Your thoughts, truly private.",
  keywords: ["journal", "AI", "encrypted", "private", "memory", "diary"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sourceSerif.variable} ${merriweather.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <PrivyAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster
              theme="dark"
              toastOptions={{
                style: {
                  background: "hsl(160 35% 8%)",
                  border: "1px solid hsl(160 20% 18%)",
                  color: "hsl(30 10% 96%)",
                },
              }}
            />
          </ThemeProvider>
        </PrivyAuthProvider>
      </body>
    </html>
  );
}
