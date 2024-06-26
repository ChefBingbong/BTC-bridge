import { SaasProvider } from "@saas-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useMemo } from "react";
import { WagmiProvider } from "wagmi";
import { createWagmiConfig } from "~/config/wagmiConfig";
import { TransactionFlowStateProvider } from "./context/useTransactionFlowState";
import NotificationProvider from "./context/useNotificationState";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const wagmiConfig = useMemo(() => createWagmiConfig(), []);
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TransactionFlowStateProvider>
          <NotificationProvider>
            <NextThemeProvider>
              <SaasProvider>{children}</SaasProvider>
            </NextThemeProvider>
          </NotificationProvider>
        </TransactionFlowStateProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
