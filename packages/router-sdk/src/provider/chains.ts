import { ChainId } from '@pancakeswap/chains'
import {
  bscTestnet,
  bsc as bsc_,
  sepolia,
  mainnet,
  type Chain,
  neonDevnet as _neonDevnet,
  arbitrumSepolia,
} from 'viem/chains'

export enum ExtendedChainId {
  LOCAL = 31337,
}

const bsc = {
  ...bsc_,
  rpcUrls: {
    ...bsc_.rpcUrls,
    public: {
      ...bsc_.rpcUrls.default,
      http: ['https://bsc-dataseed.binance.org/'],
    },
    default: {
      ...bsc_.rpcUrls.default,
      http: ['https://bsc-dataseed.binance.org/'],
    },
  },
} satisfies Chain

const neonDevnet = {
  ..._neonDevnet,
  rpcUrls: {
    public: {
      http: ['https://neon-evm-devnet.drpc.org'],
    },
    default: {
      http: ['https://neon-evm-devnet.drpc.org'],
    },
  },
} satisfies Chain

export const CHAINS = [bsc, bscTestnet, mainnet, sepolia, neonDevnet, arbitrumSepolia]

export const PUBLIC_NODES: Record<number, string[]> = {
  [ChainId.BSC]: [
    'https://bsc.publicnode.com',
    'https://binance.llamarpc.com',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed1.binance.org',
  ].filter(Boolean),
  [ChainId.BSC_TESTNET]: ['https://data-seed-prebsc-1-s2.binance.org:8545'],
  [ChainId.ETHEREUM]: [
    'https://ethereum.publicnode.com',
    'https://eth.llamarpc.com',
    'https://cloudflare-eth.com',
  ].filter(Boolean),
  [ChainId.SEPOLIA]: ['https://rpc.sepolia.org'],
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepolia.rpcUrls.default.http as any,

  [245022926]: ['https://neon-evm-devnet.drpc.org'],
} satisfies Record<number, string[]>

export const ChainsAdapter: { [chainId: number]: Chain } = {
  [ChainId.ETHEREUM]: mainnet,
  [ChainId.BSC]: bsc_,
  [ChainId.SEPOLIA]: sepolia,
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepolia,

  [245022926]: neonDevnet,
}

export const allChains = Object.values(ChainsAdapter)
