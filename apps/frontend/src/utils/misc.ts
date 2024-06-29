import { memoize } from "lodash";
import { getAddress, type Address } from "viem";
import {
  type Currency,
  type CurrencyAmount,
  Fraction,
  type Percent,
  type Price,
  Rounding,
} from "@pancakeswap/swap-sdk-core";

export function formatPercent(percent?: Percent, precision?: number) {
  return percent
    ? formatFraction(percent.asFraction.multiply(100), precision)
    : undefined;
}

export function formatFraction(
  fraction?: Fraction | null | undefined,
  precision: number | undefined = 6,
  rounding: Rounding | undefined = undefined,
) {
  if (!fraction || fraction.denominator === 0n) {
    return undefined;
  }
  if (fraction.greaterThan(10n ** BigInt(precision))) {
    return fraction.toFixed(0);
  }
  return fraction.toSignificant(precision, undefined, rounding);
}

export function formatPrice(
  price?: Price<Currency, Currency> | null | undefined,
  precision?: number | undefined,
) {
  if (!price) {
    return undefined;
  }
  return formatFraction(price?.asFraction.multiply(price?.scalar), precision);
}

export function formatAmount(
  amount?: CurrencyAmount<Currency> | null | undefined,
  precision?: number | undefined,
) {
  if (!amount) {
    return undefined;
  }
  return formatFraction(
    amount?.asFraction.divide(10n ** BigInt(amount?.currency.decimals)),
    precision,
    Rounding.ROUND_DOWN,
  );
}

export function parseNumberToFraction(num: number, precision = 6) {
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return undefined;
  }
  const scalar = 10 ** precision;
  return new Fraction(BigInt(Math.floor(num * scalar)), BigInt(scalar));
}

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
