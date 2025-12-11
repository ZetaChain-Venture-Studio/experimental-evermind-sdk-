"use client";

import { PrivyProvider, usePrivy as usePrivyOriginal } from "@privy-io/react-auth";

export function PrivyAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmhwlx82v000xle0cde4rjy5y"}
      config={{
        loginMethods: ["wallet"],
        appearance: {
          theme: "light",
          accentColor: "#8B7EC8",
          logo: undefined,
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "off",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

// Re-export usePrivy for convenience
export const usePrivy = usePrivyOriginal;
