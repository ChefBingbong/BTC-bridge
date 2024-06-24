import { SaasProvider } from "@saas-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { WagmiProvider } from "wagmi";
import { createWagmiConfig } from "~/config/wagmiConfig";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const wagmiConfig = useMemo(() => createWagmiConfig(), []);
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SaasProvider>{children}</SaasProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
