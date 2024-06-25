import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { useAccount, useBlockNumber, useChainId } from "wagmi";

export const useBlock = () => {
  const chainId = useChainId();
  const { address: account } = useAccount();

  const { data, status, ...rest } = useBlockNumber({
    chainId,
    query: {
      enabled: !!account,
    },
    watch: true,
  });

  return {
    ...rest,
    fetchStatus: status,
    blockNumber: useMemo(
      (): number | undefined =>
        typeof data !== "undefined"
          ? new BigNumber(data.toString()).toNumber()
          : undefined,
      [data],
    ),
  };
};
