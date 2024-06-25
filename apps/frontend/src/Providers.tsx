import { SaasProvider } from "@saas-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { WagmiProvider } from "wagmi";
import { createWagmiConfig } from "~/config/wagmiConfig";
import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";

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
