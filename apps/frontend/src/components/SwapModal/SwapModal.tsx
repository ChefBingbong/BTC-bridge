import {
  UilAngleDown,
  UilCopy,
  UilSpinner,
  UilSearch,
} from "@iconscout/react-unicons";
import { CurrencyAmount, type Currency } from "@pancakeswap/sdk";
import type React from "react";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  GlowFourth,
  GlowSecondary,
  GlowThird,
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
import styled from "styled-components";

export const SummaryBar = styled(Flex)<{ hide: boolean; elHeight: number }>`
  overflow-y: hidden;
  transition: height 0.2s ease-in-out;
  height: ${({ hide, elHeight }) => (hide ? "0px" : `${elHeight}px`)};
`;

const SwapModal = () => {
  const { address } = useAccount();
  const { typedValue } = useSwapState();
  const [isActive, setActive] = useState(false);
  const [elementHeight, setElementHeight] = useState<number>(20);
  const [show, setShow] = useState<boolean>(false);

  const containerRef = useRef(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const handleExpandClick = useCallback(() => setShow(!show), [show]);

  const handleOnBlur = useCallback(() => {
    setTimeout(() => {
      setActive(false);
    }, 100);
  }, []);

  useEffect(() => {
    const elRef = contentRef.current;
    if (elRef) setElementHeight(elRef.scrollHeight);
  }, []);

  return (
    <>
      <div className="grid h-screen w-full grid-rows-6">
        <div className=" row-span-1 " />

        <div className="z-10 row-span-5 flex  items-center justify-center">
          <div className="  h-full ">
            <div className=" grid-cols  grid">
              <div className="col-span-3 ">
                <BridgeModalContainer ref={containerRef}>
                  <div className="flex justify-between px-2">
                    <div className="text-[rgb(220,248,253)]">Swap</div>
                    <CloseIcon
                      color="rgb(172, 201, 242)"
                      onClick={handleExpandClick}
                    />
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
                  <SummaryBar
                    ref={contentRef}
                    hide={show}
                    elHeight={elementHeight}
                    // alignItems="center"
                  >
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
                  </SummaryBar>
                  <CurrencyInputField
                    currency={outputCurrency}
                    onCurrencySelect={handleOutputSelect}
                    onTypeInput={handleTypeOutput}
                    inputValue={fees.outputValueMinusFees}
                    currencyLoading={output.outputLoading}
                  />
                  {/* <Flex width="100%" mt="6px">
                    <BoxItemContainer allignment="center">
                      <div
                        className={
                          "relative flex  h-[55px] w-full items-center justify-center rounded-xl border bg-[rgb(255,255,255,0.9)] px-4 hover:bg-[rgb(255,255,255)]  "
                        }
                        style={{
                          // background: isActive ? "rgb(240,227,254)" : undefined,
                          border: "border: 1.2px solid rgb(244, 242, 243)",
                          boxShadow:
                            "inset 1px 0px 1px 1px rgba(175, 151, 196, 0.35)",
                        }}
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
                  </Flex> */}
                  <Flex
                    width="100%"
                    justifyContent="space-between"
                    py="8px"
                    px="10px"
                  >
                    <Flex justifyContent="space-between" width="100%">
                      <Box width="max-content">
                        <Text
                          width="max-content"
                          fontSize="13px"
                          color="#7A6EAA"
                          fontWeight="600"
                        >
                          {"Custome Fees"}
                        </Text>
                      </Box>

                      <Flex
                        width="max-content"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Toggle checked={false} onChange={handleOnBlur} />
                        {/* <Text
                  pl="2px"
                  fontSize="13px"
                  fontWeight="500"
                  color="rgb(325, 235, 235)"
                >
                  {`${data}`}
                </Text> */}
                      </Flex>
                    </Flex>
                  </Flex>

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
                <div className="my-1 px-[6px]">
                  <TradeDetails
                    trade={trade}
                    inputAmounts={input}
                    outputAmounts={output}
                    feeAmounts={fees}
                  />
                </div>
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
      </div>

      <GlowSecondary />
      <GlowThird />
      <GlowFourth />
    </>
  );
};

export default SwapModal;
