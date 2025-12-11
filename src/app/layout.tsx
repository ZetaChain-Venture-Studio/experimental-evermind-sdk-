import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PrivyAuthProvider } from "@/components/providers/privy-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Evermind AI - Demo Showcase",
  description: "Experience the power of AI with memory - Demo applications powered by Evermind AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <PrivyAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster
              theme="light"
              toastOptions={{
                style: {
                  background: "white",
                  border: "1px solid #e5e7eb",
                  color: "#1f2937",
                },
              }}
            />
          </ThemeProvider>
        </PrivyAuthProvider>
      </body>
    </html>
  );
}
