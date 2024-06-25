import { memoize } from "lodash";
import { getAddress, type Address } from "viem";

export const notEmpty = <TValue>(
  value: TValue | null | undefined,
): value is TValue => {
  return value !== null && value !== undefined;
};

export const shortenAddress = (d: string | Address, offset = 5) => {
  return `${d?.substring(0, offset)}...${d?.substring(d?.length - offset, d?.length)}`;
};

export const safeGetAddress = memoize(
  (value: string | Address): Address | undefined => {
    try {
      let value_ = value;
      if (typeof value === "string" && !value.startsWith("0x")) {
        value_ = `0x${value}`;
      }
      return getAddress(value_);
    } catch {
      return undefined;
    }
  },
);
