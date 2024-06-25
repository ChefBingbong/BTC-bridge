import {
  type TokenAddressMap as TTokenAddressMap,
  type TokenInfo,
  type TokenList,
  WrappedTokenInfo,
} from "@pancakeswap/token-lists";
import groupBy from "lodash/groupBy";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";
import uniqBy from "lodash/uniqBy";
import DEFAULT_TOKEN_LIST from "../config/tokenLists/default-token-list.json";
import { memoize } from "lodash";
import { type Address, getAddress } from "viem";

type TokenAddressMap = TTokenAddressMap<number>;

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export const safeGetAddress = memoize((value: any): Address | undefined => {
  try {
    let value_ = value;
    if (typeof value === "string" && !value.startsWith("0x")) {
      value_ = `0x${value}`;
    }
    return getAddress(value_);
  } catch {
    return undefined;
  }
});
export function listToTokenMap(list: TokenList, key?: string): TokenAddressMap {
  const tokenMap: WrappedTokenInfo[] = uniqBy(
    list.tokens,
    (tokenInfo: TokenInfo) => `${tokenInfo.chainId}#${tokenInfo.address}`,
  )
    .map((tokenInfo) => {
      const checksummedAddress = safeGetAddress(tokenInfo.address);
      if (checksummedAddress) {
        return new WrappedTokenInfo({
          ...tokenInfo,
          address: checksummedAddress,
        });
      }
      return null;
    })
    .filter(notEmpty);

  const groupedTokenMap: { [chainId: string]: WrappedTokenInfo[] } = groupBy(
    tokenMap,
    "chainId",
  );

  const tokenAddressMap = mapValues(groupedTokenMap, (tokenInfoList) =>
    mapValues(keyBy(tokenInfoList, key), (tokenInfo) => ({
      token: tokenInfo,
      list,
    })),
  ) as TokenAddressMap;

  // add chain id item if not exist
  // biome-ignore lint/complexity/noForEach: <explanation>
  //           enumKeys(ChainId).forEach((chainId) => {
  //   if (!(ChainId[chainId] in tokenAddressMap)) {
  //     Object.defineProperty(tokenAddressMap, ChainId[chainId], {
  //       value: {},
  //     })
  //   }
  // })

  return tokenAddressMap;
}

const combineTokenMapsWithDefault = () => {
  const defaultTokenMap = listToTokenMap(
    DEFAULT_TOKEN_LIST as TokenList,
    "address",
  );
  return defaultTokenMap;
};

export const combinedTokenMapFromActiveUrlsAtom = () => {
  return combineTokenMapsWithDefault();
};
