import { createReducer } from "@reduxjs/toolkit";
import { atomWithReducer } from "jotai/utils";
import {
  Field,
  replaceSwapState,
  selectFeeCurrency,
  selectInputCurrency,
  selectOutputCurrency,
  switchCurrencies,
  typeInput,
} from "./actions";

export interface SwapState {
  readonly independentField: Field;
  readonly typedValue: string;
  readonly inverted: boolean;
  readonly inputCurrencyId: string | undefined;
  readonly outputCurrencyId: string | undefined;
  readonly feeCurrencyId: string | undefined;
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  inverted: false,
  typedValue: "",
  inputCurrencyId: "",
  outputCurrencyId: "",
  feeCurrencyId: "",
};

const reducer = createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(
      replaceSwapState,
      (
        state,
        {
          payload: {
            typedValue,
            field,
            inputCurrencyId,
            outputCurrencyId,
            feeCurrencyId,
            inverted,
          },
        },
      ) => {
        return {
          ...state,
          inverted: Boolean(inverted),
          inputCurrencyId: inputCurrencyId,
          feeCurrencyId: feeCurrencyId,
          outputCurrencyId: outputCurrencyId,
          independentField: field,
          typedValue,
        };
      },
    )
    .addCase(selectInputCurrency, (state, { payload: { inputCurrencyId } }) => {
      return {
        ...state,
        inputCurrencyId,
      };
    })
    .addCase(selectFeeCurrency, (state, { payload: { feeCurrencyId } }) => {
      return {
        ...state,
        feeCurrencyId,
      };
    })
    .addCase(
      selectOutputCurrency,
      (state, { payload: { outputCurrencyId } }) => {
        return {
          ...state,
          outputCurrencyId,
        };
      },
    )
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        inverted: !!state.inverted,
        independentField:
          state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        inputCurrencyId: state.outputCurrencyId,
        outputCurrencyId: state.inputCurrencyId,
      };
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      };
    }),
);

export const swapReducerAtom = atomWithReducer(initialState, reducer);
