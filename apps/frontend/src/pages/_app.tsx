import x from "@eth-dub-2024/router-sdk";
import { SaasProvider } from "@saas-ui/react";
import { GeistSans } from "geist/font/sans";
import type { AppType } from "next/app";
import { WagmiConfig, createConfig, createStorage } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import "~/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  arbitrum,
  arbitrumGoerli,
  arbitrumSepolia,
  base,
  baseGoerli,
  baseSepolia,
  goerli,
  linea,
  lineaTestnet,
  mainnet,
  opBNB,
  opBNBTestnet,
  polygonZkEvm,
  polygonZkEvmTestnet,
  scrollSepolia,
  sepolia,
  zkSync,
  type Chain,
} from "viem/chains";

import { TransactionFlowStateProvider } from "~/context/useTransactionFlowState";
import { noopStorage, publicClient } from "../config/wagmiConfig";
import NotificationProvider from "~/context/useNotificationState";

export const CHAINS: [Chain, ...Chain[]] = [
  bsc,
  bscTestnet,
  mainnet,
  goerli,
  sepolia,
  polygonZkEvm,
  polygonZkEvmTestnet,
  zkSync,
  arbitrum,
  arbitrumGoerli,
  arbitrumSepolia,
  linea,
  lineaTestnet,
  base,
  baseGoerli,
  baseSepolia,
  opBNB,
  opBNBTestnet,
  scrollSepolia,
];

export function Providers({ children }: { children: React.ReactNode }) {
  return <SaasProvider>{children}</SaasProvider>;
}

const queryClient = new QueryClient();

export const wagmiconfig = createConfig({
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : noopStorage,
    key: "wagmi_v1.1",
  }),
  autoConnect: false,
  connectors: [new MetaMaskConnector({ chains: CHAINS as any })],
  publicClient: publicClient,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  console.log(x);
  return (
    <main className={GeistSans.className}>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <Providers>
            <WagmiConfig config={wagmiconfig}>
              <TransactionFlowStateProvider>
                <Component {...pageProps} />
              </TransactionFlowStateProvider>
            </WagmiConfig>
          </Providers>
        </NotificationProvider>
      </QueryClientProvider>
    </main>
  );
};

export default MyApp;
