import { useMemo } from "react";
import { Field } from "~/state/swap/actions";
import { useSwapState } from "~/state/swap/hooks";
import { TradeCurrencies } from "~/types";
import { useCurrency } from "./useCurrency";

export const useSwapCurrencyOrder = (): {
  tradeCurrencies: TradeCurrencies;
} => {
  const { inputCurrencyId, independentField, feeCurrencyId, outputCurrencyId } =
    useSwapState();

  const isInputField = independentField === Field.INPUT;
  const inCurrency = useCurrency(inputCurrencyId);
  const feeCurrency = useCurrency(feeCurrencyId);
  const outCurrency = useCurrency(outputCurrencyId);

  const inputCurrency = useMemo(
    () => (isInputField ? inCurrency : outCurrency),
    [isInputField, inCurrency, outCurrency],
  );
  const outputCurrency = useMemo(
    () => (isInputField ? outCurrency : inCurrency),
    [isInputField, inCurrency, outCurrency],
  );

  return {
    tradeCurrencies: { inputCurrency, outputCurrency, feeCurrency },
  };
};
