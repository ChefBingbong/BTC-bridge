import { ChainId } from "@pancakeswap/chains";
import {
  sepolia,
  mainnet,
  type Chain,
  neonDevnet,
  arbitrumSepolia,
} from "viem/chains";

export const CHAINS: [Chain, ...Chain[]] = [
  mainnet,
  sepolia,
  neonDevnet,
  arbitrumSepolia,
];

export const PUBLIC_NODES: Record<number, string[] | readonly string[]> = {
  [ChainId.ETHEREUM]: [
    "https://ethereum.publicnode.com",
    "https://eth.llamarpc.com",
    "https://cloudflare-eth.com",
  ].filter(Boolean),
  [ChainId.SEPOLIA]: ["https://rpc.sepolia.org"],
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepolia.rpcUrls.default
    .http as unknown as string[],
} satisfies Record<number, string[]>;

export const ChainsAdapter: { [chainId: number]: Chain } = {
  [ChainId.SEPOLIA]: sepolia,
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepolia,
};

export const allChains = Object.values(ChainsAdapter);
