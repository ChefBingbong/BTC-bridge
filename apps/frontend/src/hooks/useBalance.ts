import type { ERC20Token } from "@pancakeswap/sdk";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";

export const useTokenBalance = (asset?: ERC20Token) => {
  const { address: account } = useAccount();

  const { data, status, ...rest } = useReadContract({
    chainId: asset?.chainId,
    abi: erc20Abi,
    address: asset?.address,
    functionName: "balanceOf",
    args: [account ?? "0x"],
    query: {
      enabled: !!account,
    },
  });

  return {
    ...rest,
    fetchStatus: status,
    balance: useMemo(
      () =>
        typeof data !== "undefined" && asset
          ? new BigNumber(data.toString())
              .shiftedBy(-asset?.decimals)
              .toFixed(3)
          : new BigNumber(0),
      [data, asset],
    ),
  };
};
