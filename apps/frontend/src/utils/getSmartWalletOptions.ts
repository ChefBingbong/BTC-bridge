import type { ChainId } from "@pancakeswap/chains";
import { Currency, Percent } from "@pancakeswap/swap-sdk-core";
import {
  type RouterTradeType,
  Routers,
  type WalletAllownceDetails,
  type SmartWalletTradeOptions,
} from "@btc-swap/router-sdk";
import type { Address } from "viem";

export const getSmartWalletOptions = (
  address: Address,
  outAllowance: WalletAllownceDetails,
  inAllowance: WalletAllownceDetails,
  chainId: ChainId,
  feeAsset: Currency,
  type: RouterTradeType,
  smartWalletDetails: any,
): SmartWalletTradeOptions => {
  return {
    account: address,
    chainId,
    feeAsset,
    SmartWalletTradeType: type,
    smartWalletDetails: smartWalletDetails,
    inAllowance,
    outAllowance,
    slippageTolerance: new Percent(1),
  };
};
