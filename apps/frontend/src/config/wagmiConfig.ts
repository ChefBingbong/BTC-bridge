import { createConfig, fallback, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { CHAINS } from "./chains";

import type { Transport } from "viem";
import { injected } from "wagmi/connectors";

export const noopStorage = {
  getItem: (_key: never) => "",
  setItem: (_key: never, _value: never) => null,
  removeItem: (_key: never) => null,
};

export const injectedConnector = injected({
  shimDisconnect: false,
});
export const metaMaskConnector = injected({
  target: "metaMask",
  shimDisconnect: false,
});

const PUBLIC_MAINNET = "https://ethereum.publicnode.com";

export const chains = CHAINS;

export const transports = chains.reduce(
  (ts, chain) => {
    let httpStrings: string[] | readonly string[] | undefined = [];

    if (process.env.NODE_ENV === "test" && chain.id === mainnet.id) {
      httpStrings = [PUBLIC_MAINNET];
    } else {
      const nodeRpc = CHAINS.find((c) => c.id === chain.id)?.rpcUrls.default
        .http;
      httpStrings = nodeRpc ? nodeRpc : [];
    }

    if (ts && httpStrings) {
      return {
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        ...ts,
        [chain.id]: fallback(httpStrings.map((t) => http(t))),
      };
    }

    return {
      [chain.id]: fallback(
        (httpStrings as string[] | readonly string[]).map((t) => http(t)),
      ),
    };
  },
  {} as Record<number, Transport>,
);

export const CLIENT_CONFIG = {
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
};

export function createWagmiConfig() {
  return createConfig({
    chains,
    // ssr: true,
    syncConnectedChain: true,
    transports,
    ...CLIENT_CONFIG,
    connectors: [metaMaskConnector],
  });
}
