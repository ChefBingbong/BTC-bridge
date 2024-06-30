import {
  UilAngleDown,
  UilCopy,
  UilSpinner,
  UilSearch,
} from "@iconscout/react-unicons";
import { CurrencyAmount, type Currency } from "@pancakeswap/sdk";
import type React from "react";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { ChevronDown } from "react-feather";
import { useAccount, useChainId, useSignTypedData } from "wagmi";
import { useTokenBalance } from "~/hooks/useBalance";
import { NativeBtc } from "~/config/NativeBtc";
import PrimaryButton from "../Button/PrimaryButton/PrimaryButton";
import { ChainLogo } from "../CurrencyLogo/ChainLogo";
import { CurrencyLogo } from "../CurrencyLogo/CurrencyLogo";
import { CurrencySelectPopOver, TokenSearchBar } from "./CurrencySelectPopOver";
import { formatAmount } from "~/utils/misc";
import {
  ArrowDownContainer,
  BridgeModalContainer,
  ButtonContents,
  ButtonWrapper,
  CloseIcon,
  GlowSecondary,
  InfoWrapper,
  SelectedToken,
  TokenAmountContainer,
  TokenAmountWrapper,
  TokenInput,
  TokenSelectButton,
  TransactionRowontainer,
  TransactionsContainer,
} from "./styles";
import { useQuery } from "@tanstack/react-query";
import { useSmartRouterBestTrade } from "~/hooks/useSmartRouterBestTrade";
import { getSmartWalletOptions } from "~/utils/getSmartWalletOptions";
import {
  Deployments,
  RouterTradeType,
  SmartWalletRouter,
} from "@btc-swap/router-sdk";
import {
  useSmartWalletDetails,
  useSmartWalletFees,
  useAllowance,
} from "@btc-swap/react";
import {
  TransactionReceipt,
  TransactionRejectedRpcError,
  UserRejectedRequestError,
} from "viem";
import { defaultAbiCoder } from "@ethersproject/abi";
import { useSwapState, useSwapctionHandlers } from "~/state/swap/hooks";
import { Field } from "~/state/swap/actions";
import { useCurrency, useCurrencyWithId } from "~/hooks/useCurrency";
import { CurrencyInputField } from "./CurrencyInputField";
import { useSwapCurrencyAmounts } from "~/hooks/useSwapCurrencyAmounts";
import { useSwapCurrencyOrder } from "~/hooks/useSwapCurrencies";
import { TradeDetails } from "./TradeDetails";
import TransactionFlowModals from "../TxConfirmationModalFlow";
import { useTransactionFlow } from "~/context/useTransactionFlowState";
import SwapButton from "../Button/SwapButton/SwapButton";
import BigNumber from "bignumber.js";
import useDebounce from "~/hooks/useDebounce";
import { Box, Flex, Text } from "@pancakeswap/uikit";
import Toggle from "../Toggle/Toggle";
import { BoxItemContainer } from "../Navbar/styles";
import { BASES_TO_CHECK_TRADES_AGAINST } from "@pancakeswap/smart-router";

const SwapModal = () => {
  const { address } = useAccount();
  const { typedValue } = useSwapState();
  const [isActive, setActive] = useState(false);

  const { inputCurrency, outputCurrency, feeCurrency } =
    useSwapCurrencyOrder().tradeCurrencies;

  const { onUserInput, onCurrencySelection, onSwitchTokens } =
    useSwapctionHandlers();

  const handleInputSelect = useCallback(
    (newCurrency: Currency) => onCurrencySelection(Field.INPUT, newCurrency),
    [onCurrencySelection],
  );
  const handleFeeSelect = useCallback(
    (newCurrency: Currency) => onCurrencySelection(Field.FEE, newCurrency),
    [onCurrencySelection],
  );
  const handleOutputSelect = useCallback(
    (newCurrency: Currency) => onCurrencySelection(Field.OUTPUT, newCurrency),
    [onCurrencySelection],
  );

  const { data: inAllowance } = useAllowance(inputCurrency, address);
  const { data: outAllowance } = useAllowance(feeCurrency, address);

  const amountInBE = BigNumber(typedValue).shiftedBy(
    inputCurrency?.decimals ?? 18,
  );
  const deferQuotientRaw = useDeferredValue(amountInBE.toString());
  const deferQuotient = useDebounce(deferQuotientRaw, 500);

  const { data: trade, isLoading: tradeLoading } = useSmartRouterBestTrade({
    toAsset: outputCurrency,
    fromAsset: inputCurrency,
    chainId: inputCurrency?.chainId,
    account: address,
    amount: deferQuotient,
  });

  const { data: smartWalletDetails } = useSmartWalletDetails(
    address!,
    inputCurrency?.chainId,
  );
  console.log(inputCurrency?.decimals);
  console.log(deferQuotientRaw);
  console.log(deferQuotient);

  const handleTypeInput = useCallback(
    (value: string) => onUserInput(Field.INPUT, value),
    [onUserInput],
  );
  const handleTypeOutput = useCallback(
    (value: string) => onUserInput(Field.OUTPUT, value),
    [onUserInput],
  );
  const { input, output, fees } = useSwapCurrencyAmounts(trade, tradeLoading);

  const handleOnBlur = useCallback(() => {
    setTimeout(() => {
      setActive(false);
    }, 100);
  }, []);
  return (
    <>
      <div className="grid h-screen w-full grid-rows-6">
        <div className=" row-span-1 " />

        <div className="z-10 row-span-5 flex  items-center justify-center">
          <div className="  h-full ">
            <div className=" grid-cols  grid">
              <div className="col-span-3 ">
                <BridgeModalContainer>
                  <div className="flex justify-between px-2">
                    <div className="text-[rgb(220,248,253)]">Swap</div>
                    <CloseIcon color="rgb(172, 201, 242)" />
                    <ArrowDownContainer onClick={onSwitchTokens}>
                      <UilAngleDown className={"h-6 w-6 "} />
                    </ArrowDownContainer>
                  </div>
                  <CurrencyInputField
                    currency={inputCurrency}
                    onCurrencySelect={handleInputSelect}
                    onTypeInput={handleTypeInput}
                    inputValue={input.inputValue}
                    currencyLoading={input.inputLoading}
                  />
                  <CurrencyInputField
                    currency={feeCurrency}
                    onCurrencySelect={handleFeeSelect}
                    onTypeInput={() => null}
                    inputValue={
                      formatAmount(fees?.fees?.gasCostInBaseToken) ?? ""
                    }
                    disabled
                    currencyLoading={fees.feesLoading}
                  />
                  <CurrencyInputField
                    currency={outputCurrency}
                    onCurrencySelect={handleOutputSelect}
                    onTypeInput={handleTypeOutput}
                    inputValue={fees.outputValueMinusFees}
                    currencyLoading={output.outputLoading}
                  />
                  <Flex width="100%" mt="6px">
                    <BoxItemContainer allignment="center">
                      <div
                        className={
                          "relative flex  h-[50px] w-full items-center justify-center rounded-xl border border-[rgb(214,182,263)] bg-[rgb(244,240,255)] px-4  "
                        }
                        style={
                          {
                            // background: isActive ? "rgb(240,227,254)" : undefined,
                          }
                        }
                      >
                        <input
                          value={""}
                          onChange={(e) => null}
                          className="font-500 flex-1 bg-transparent text-[14px] font-medium tracking-wide text-[#7A6EAA] outline-none placeholder:text-[#7A6EAA]"
                          placeholder={"Paste your BTC address"}
                          onMouseEnter={() => setActive(true)}
                          onMouseLeave={handleOnBlur}
                        />
                      </div>
                    </BoxItemContainer>
                  </Flex>

                  <TradeDetails
                    trade={trade}
                    inputAmounts={input}
                    outputAmounts={output}
                    feeAmounts={fees}
                  />

                  <SwapButton
                    trade={trade}
                    inAllowance={inAllowance}
                    outAllowance={outAllowance}
                    smartWalletDetails={smartWalletDetails}
                    input={input}
                    output={output}
                    fees={fees}
                  />
                </BridgeModalContainer>
              </div>
              {/* <div className="col-span-5 flex  w-full justify-end">
                <TransactionsContainer>
                  <div className="flex flex-col justify-center">
                    <span className="font-semobold text-[15px] text-white">
                      Transactions
                    </span>
                  </div>
                  <div className="mt-2 flex h-full w-full flex-col">
                    <TransactionRowontainer></TransactionRowontainer>
                  </div>
                </TransactionsContainer>
              </div> */}
            </div>
          </div>
        </div>

        {/* <GlowSecondary /> */}
      </div>
    </>
  );
};

export default SwapModal;
