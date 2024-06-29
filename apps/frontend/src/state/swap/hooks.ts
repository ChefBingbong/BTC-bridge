import type { Currency } from "@pancakeswap/swap-sdk-core";
import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "node:querystring";
import { useCallback, useEffect } from "react";
import {
  Field,
  replaceSwapState,
  selectInputCurrency,
  selectOutputCurrency,
  selectFeeCurrency,
  switchCurrencies,
  typeInput,
} from "./actions";
import { swapReducerAtom, type SwapState } from "./reducer";

export function useSwapState() {
  return useAtomValue(swapReducerAtom);
}

function parseTokenAmountURLParameter(urlParam: unknown): string {
  return typeof urlParam === "string" &&
    !Number.isNaN(Number.parseFloat(urlParam))
    ? urlParam
    : "";
}

export function useSwapctionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void;
  onSwitchTokens: () => void;
  onUserInput: (filed: Field, typedValue: string | number) => void;
} {
  const [, dispatch] = useAtom(swapReducerAtom);

  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      if (field === Field.INPUT) {
        dispatch(
          selectInputCurrency({
            inputCurrencyId: currency?.isNative
              ? currency.symbol
              : currency.wrapped.address,
          }),
        );
      } else if (field === Field.FEE) {
        dispatch(
          selectFeeCurrency({
            feeCurrencyId: currency?.isNative
              ? currency.symbol
              : currency.wrapped.address,
          }),
        );
      } else {
        dispatch(
          selectOutputCurrency({
            outputCurrencyId: currency?.isNative
              ? currency.symbol
              : currency.wrapped.address,
          }),
        );
      }
    },
    [dispatch],
  );

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies());
  }, [dispatch]);

  const onUserInput = useCallback(
    (field: Field, typedValue: string | number) => {
      dispatch(typeInput({ field, typedValue: typedValue.toString() }));
    },
    [dispatch],
  );

  return {
    onCurrencySelection,
    onSwitchTokens,
    onUserInput,
  };
}

export async function queryParametersToSwapState(
  parsedQs: ParsedUrlQuery,
): Promise<SwapState> {
  return {
    inputCurrencyId: "",
    outputCurrencyId: "",
    feeCurrencyId: "",
    typedValue: "", //parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: Field.INPUT,
    inverted: false,
  };
}

export function useDefaultsFromURLSearch() {
  const [, dispatch] = useAtom(swapReducerAtom);
  const { query, isReady } = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!isReady) return;
      const parsed = await queryParametersToSwapState(query);

      dispatch(
        replaceSwapState({
          field: Field.INPUT,
          typedValue: "",
          inputCurrencyId: parsed.inputCurrencyId,
          outputCurrencyId: parsed.feeCurrencyId,
          feeCurrencyId: parsed.outputCurrencyId,
          inverted: parsed.inverted,
        }),
      );
    };
    fetchData();
  }, [dispatch, query, isReady]);
}
