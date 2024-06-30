import { useSmartWalletFees } from "@btc-swap/react";
import { SmartRouterTrade } from "@pancakeswap/smart-router";
import { TradeType } from "@pancakeswap/swap-sdk-core";
import { useMemo } from "react";
import { Field } from "~/state/swap/actions";
import { useSwapState } from "~/state/swap/hooks";
import { TradeCurrencies } from "~/types";
import { formatAmount } from "~/utils/misc";
import { useSwapCurrencyOrder } from "./useSwapCurrencies";

export const useSwapCurrencyAmounts = (
  trade: SmartRouterTrade<TradeType> | null | undefined,
  isFetchingTrade: boolean,
) => {
  const { typedValue, independentField } = useSwapState();
  const { tradeCurrencies } = useSwapCurrencyOrder();

  const {
    data: fees,
    isLoading: feesLoading,
    isFetching: feesFetching,
  } = useSmartWalletFees(
    tradeCurrencies?.inputCurrency!,
    tradeCurrencies?.feeCurrency,
    tradeCurrencies?.outputCurrency,
    typedValue,
  );
  const isTypingInput = independentField === Field.INPUT;
  const inputLoading = typedValue ? !isTypingInput && isFetchingTrade : false;
  const outputLoading = typedValue ? isTypingInput && isFetchingTrade : false;

  const inputValue = useMemo(
    () =>
      typedValue &&
      (isTypingInput ? typedValue : formatAmount(trade?.outputAmount) || ""),
    [typedValue, isTypingInput, trade],
  );

  const outputValue = useMemo(
    () =>
      typedValue &&
      (!isTypingInput ? typedValue : formatAmount(trade?.outputAmount) || ""),
    [typedValue, isTypingInput, trade],
  );

  const outputValueMinusFees = useMemo(() => {
    if (!typedValue || !fees) return "";

    return formatAmount(trade?.outputAmount.subtract(fees.gasCostInQuoteToken));
  }, [typedValue, trade, fees]);

  return {
    fees: {
      feesLoading: feesLoading || feesFetching,
      fees,
      outputValueMinusFees,
    },
    input: { inputLoading, inputValue },
    output: { outputLoading, outputValue },
  };
};
