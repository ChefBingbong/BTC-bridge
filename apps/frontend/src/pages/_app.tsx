import { SaasProvider } from "@saas-ui/react";
import { GeistSans } from "geist/font/sans";
import type { AppType } from "next/app";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { createWagmiConfig } from "~/config/wagmiConfig";

import "~/styles/globals.css";

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

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={GeistSans.className}>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </main>
  );
};

export default MyApp;
