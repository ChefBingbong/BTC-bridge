import { ChainId } from '@pancakeswap/chains'
import { zeroAddress, type Address } from 'viem'

export enum Contracts {
  ECDSAWalletFactory = 'ECDSAWalletFactory',
  SmartWalletFactory = 'SmartWalletFactory',
  Cake = 'Cake',
  Busd = 'Busd',
  PancakeSwapV3Facotry = 'PancakeSwapV3Facotry',
  WETH9 = 'WETH9',
  PancakeSwapV2Facotry = 'PancakeSwapV2Facotry',
}
export enum ExtendedChainId {
  LOCAL = 31337,
}
type Deployments = {
  [chainId: number]: { [contract in Contracts]: Address }
}

export const Deployments: Deployments = {
  [ChainId.BSC_TESTNET]: {
    // ECDSAWalletFactory: '0x6b4Ec059199883dfE189E8f131d2e79044a52eA3',
    // SmartWalletFactory: '0x518B14d78DF55F51508281F58352E1607177B685',
    ECDSAWalletFactory: '0xAfB1Dae41013A0464A076e5d91315159Fd289B58',
    SmartWalletFactory: '0xa52f84eB81e71dE2D099F6f2D61Fd187CA66d79B',

    Cake: '0x501B55184813f7a29eb98DECD8EC9B6D07DEB263',
    Busd: '0x6F451Eb92d7dE92DdF6939d9eFCE6799246B3a4b',
    PancakeSwapV3Facotry: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
    PancakeSwapV2Facotry: '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
    WETH9: '0xCE79F78537f95a2256e76A3FE4b99D3af148833F',
  }, //0x580b978cC31aDb5065f9e8401f076b7Da7eD4b4A
  [ChainId.SEPOLIA]: {
    //     ECDSAWalletFactory: "0x7dF8BEaeD25fe010655Da27D7393A317e35C7361",
    //     SmartWalletFactory: "0xb5C56531Bdd3A05EC4901a30fF12c98Ef31925C5",
    ECDSAWalletFactory: '0xED6e16c022dc8FfF0c223Fd28758af5213285C1C',
    SmartWalletFactory: '0xF52b49508F4Be8d9070c5421c69bc6Ab609b8514',
    Cake: '0x201873Ad6b36b16aAc7ed82273C41BF80Fc71A52',
    Busd: '0x63A9C123A57125BB53DB19A114b7C0AE80993c91',
    PancakeSwapV3Facotry: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
    PancakeSwapV2Facotry: '0x1bdc540dEB9Ed1fA29964DeEcCc524A8f5e2198e',
    WETH9: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  },
  [245022926]: {
    //     ECDSAWalletFactory: "0x7dF8BEaeD25fe010655Da27D7393A317e35C7361",
    //     SmartWalletFactory: "0xb5C56531Bdd3A05EC4901a30fF12c98Ef31925C5",
    ECDSAWalletFactory: '0xba350c11Cb19bA4AFDcc9aD0698fE495F982bAF4',
    SmartWalletFactory: '0x36Aef0c16b030BC508C8d99867ca3b2be1dF9fA2',
    Cake: '0x4860ee416b52b4769CdC2E7876b09c6B77E3BD30',
    Busd: '0x903fC5f46287e7B3C79719c3ce8F4EDBAC8b8b54',
    PancakeSwapV3Facotry: zeroAddress,
    PancakeSwapV2Facotry: zeroAddress,
    WETH9: '0x11adC2d986E334137b9ad0a0F290771F31e9517F',
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    ECDSAWalletFactory: '0x6825CbF2702292eB45AF5B6b53f5BE57D8bc2D8c',
    SmartWalletFactory: '0x2842e1B6E93BC518b7aA065B500F4dF047992B52',

    Cake: '0x4860ee416b52b4769CdC2E7876b09c6B77E3BD30',
    Busd: '0x903fC5f46287e7B3C79719c3ce8F4EDBAC8b8b54',
    PancakeSwapV3Facotry: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
    PancakeSwapV2Facotry: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
    WETH9: '0x62267B2BB09639053d85D03A0D38D89DA91ceD10',
    // Usdt: '0x'
  },
}
