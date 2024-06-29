/* eslint-disable no-param-reassign */
import { ChainId } from "@pancakeswap/chains";
import { ERC20Token, Currency, NativeCurrency, Native } from "@pancakeswap/sdk";

import type { TokenAddressMap } from "@pancakeswap/token-lists";
import { useMemo } from "react";
import { combinedTokenMapFromActiveUrlsAtom } from "~/state/lists";
import { useChainId, useToken as useToken_ } from "wagmi";
import { NativeBtc } from "~/config/NativeBtc";
import { safeGetAddress } from "~/utils/misc";
export default function useNativeCurrency(
  overrideChainId?: ChainId | number,
): NativeCurrency {
  const chainId = useChainId();

  return useMemo(() => {
    try {
      if (overrideChainId === 0) return NativeBtc.onChain();
      return Native.onChain(overrideChainId ?? chainId ?? ChainId.BSC);
    } catch (e) {
      return Native.onChain(ChainId.BSC);
    }
  }, [overrideChainId, chainId]);
}

const mapWithoutUrls = (
  tokenMap?: TokenAddressMap<ChainId>,
): { [address: string]: ERC20Token } => {
  if (!tokenMap) return {};

  return Object.keys(tokenMap).reduce<{ [address: string]: ERC20Token }>(
    (newMap, chainId) => {
      // biome-ignore lint/complexity/noForEach: <explanation>
      Object.keys(tokenMap[chainId] || {}).forEach((address) => {
        const checksumAddress = safeGetAddress(address);

        if (checksumAddress && !newMap[checksumAddress]) {
          newMap[checksumAddress] = tokenMap[chainId][address].token;
        }
      });

      return newMap;
    },
    {},
  );
};

/**
 * Returns all tokens that are from active urls and user added tokens
 */
export function useAllTokens(): { [address: string]: ERC20Token } {
  const tokenMap = combinedTokenMapFromActiveUrlsAtom();

  return useMemo(() => {
    return mapWithoutUrls(tokenMap);
  }, [tokenMap]);
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): ERC20Token | undefined | null {
  const chainId = useChainId();
  const tokens = useAllTokens();
  const address = safeGetAddress(tokenAddress);

  const token: ERC20Token | undefined = address ? tokens[address] : undefined;

  const { data, isLoading } = useToken_({
    address: address || undefined,
    chainId,
    query: {
      enabled: Boolean(!!address && !token),
    },
    // consider longer stale time
  });

  return useMemo(() => {
    if (token) return token;
    if (!chainId || !address) return undefined;
    if (isLoading) return null;
    if (data) {
      return new ERC20Token(
        chainId,
        data.address,
        data.decimals,
        data.symbol ?? "UNKNOWN",
        data.name ?? "Unknown Token",
      );
    }
    return undefined;
  }, [token, chainId, address, isLoading, data]);
}

export function useCurrency(
  currencyId: string | undefined,
): Currency | NativeCurrency | ERC20Token | null | undefined {
  const native: NativeCurrency = useNativeCurrency();
  const isNative = currencyId?.toUpperCase() === native.symbol?.toUpperCase();

  const token = useToken(isNative ? undefined : currencyId);
  return isNative ? native : token;
}
