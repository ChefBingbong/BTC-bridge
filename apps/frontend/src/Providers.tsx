import { SaasProvider } from "@saas-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useMemo } from "react";
import { WagmiProvider } from "wagmi";
import { createWagmiConfig } from "~/config/wagmiConfig";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const wagmiConfig = useMemo(() => createWagmiConfig(), []);
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <NextThemeProvider>
          <SaasProvider>{children}</SaasProvider>
        </NextThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
