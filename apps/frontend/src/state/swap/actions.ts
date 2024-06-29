import { createAction } from "@reduxjs/toolkit";

export enum Field {
  INPUT = "INPUT",
  FEE = "FEE",
  OUTPUT = "OUTPUT",
}

export const selectInputCurrency = createAction<{
  inputCurrencyId: string;
}>("swap/selectInputCurrency");
export const selectFeeCurrency = createAction<{
  feeCurrencyId: string;
}>("swap/selectFeeCurrency");
export const selectOutputCurrency = createAction<{
  outputCurrencyId: string;
}>("swap/selectOutputCurrency");
export const switchCurrencies = createAction<void>("swap/switchCurrencies");
export const typeInput = createAction<{ field: Field; typedValue: string }>(
  "swap/typeInput",
);
export const replaceSwapState = createAction<{
  field: Field;
  typedValue: string;
  inputCurrencyId?: string;
  outputCurrencyId?: string;
  feeCurrencyId?: string;
  inverted?: boolean;
}>("swap/replaceSwapState");
