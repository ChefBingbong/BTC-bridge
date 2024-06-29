import type { ChainId } from "@pancakeswap/chains";
import { Percent } from "@pancakeswap/swap-sdk-core";
import {
  type RouterTradeType,
  Routers,
  type WalletAllownceDetails,
  type SmartWalletTradeOptions,
} from "@btc-swap/router-sdk";
import type { Address } from "viem";

export const getSmartWalletOptions = (
  address: Address,
  isUsingPermit2: boolean,
  allowance: WalletAllownceDetails,
  smartWalletDetails: never,
  chainId: ChainId,
  assets: { inputAsset: Address; feeAsset: Address; outputAsset: Address },
  type: RouterTradeType,
): SmartWalletTradeOptions => {
  return {
    account: address,
    chainId,
    assets,
    hasApprovedPermit2: allowance.t0Allowance.needsApproval,
    hasApprovedRelayer: allowance.t0Allowance.needsApproval,
    smartWalletDetails: smartWalletDetails,
    SmartWalletTradeType: type,
    router: Routers.SmartOrderRouter,
    isUsingPermit2: isUsingPermit2,
    allowance,
    walletPermitOptions: undefined,
    underlyingTradeOptions: {
      recipient: address,
      slippageTolerance: new Percent(1),
    },
  };
};
