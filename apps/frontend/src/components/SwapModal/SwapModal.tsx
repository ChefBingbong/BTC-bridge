import { UilAngleDown, UilCopy, UilSpinner } from "@iconscout/react-unicons";
import { CurrencyAmount, type Currency } from "@pancakeswap/sdk";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { ChevronDown } from "react-feather";
import { useAccount, useChainId, useSignTypedData } from "wagmi";
import { useTokenBalance } from "~/hooks/useBalance";
import { NativeBtc } from "~/config/NativeBtc";
import PrimaryButton from "../Button/PrimaryButton/PrimaryButton";
import { ChainLogo } from "../CurrencyLogo/ChainLogo";
import { CurrencyLogo } from "../CurrencyLogo/CurrencyLogo";
import { CurrencySelectPopOver } from "./CurrencySelectPopOver";
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

export const BREAKPOINTS = {
  xs: 396,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
  xxxl: 1920,
};

export enum ConfirmModalState {
  REVIEWING = -1,
  APPROVING_TOKEN = 0,
  PERMITTING = 1,
  PENDING_CONFIRMATION = 2,
  SIGNED = 3,
  EXECUTING = 4,
  COMPLETED = 5,
  FAILED = 6,
}

const SwapModal = () => {
  const { address, connector } = useAccount();
  const {
    toggleConfirmationModal,
    togglePendingModal,
    toggleRejectedModal,
    toggleSubmittedModal,
    pendingTransaction,
    setPendingTransaction,
  } = useTransactionFlow();
  const chainId = useChainId();

  const { signTypedDataAsync } = useSignTypedData();
  const { typedValue } = useSwapState();

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

  const { data: trade, isLoading: tradeLoading } = useSmartRouterBestTrade({
    toAsset: outputCurrency,
    fromAsset: inputCurrency,
    chainId: inputCurrency?.chainId,
    account: address,
    amount: typedValue,
  });

  const { data: smartWalletDetails } = useSmartWalletDetails(
    address!,
    inputCurrency?.chainId,
  );

  const handleTypeInput = useCallback(
    (value: string) => onUserInput(Field.INPUT, value),
    [onUserInput],
  );
  const handleTypeOutput = useCallback(
    (value: string) => onUserInput(Field.OUTPUT, value),
    [onUserInput],
  );
  const { input, output, fees } = useSwapCurrencyAmounts(trade, tradeLoading);

  const swap = useCallback(async () => {
    if (
      !trade ||
      !address ||
      !inAllowance ||
      !outAllowance ||
      !feeCurrency ||
      !smartWalletDetails
    )
      return;
    togglePendingModal();
    const inputAsset = trade.inputAmount.currency.wrapped;
    const options = getSmartWalletOptions(
      address,
      outAllowance,
      inAllowance,
      chainId,
      feeCurrency,
      RouterTradeType.SmartWalletTradeWithPermit2,
      smartWalletDetails as never,
    );
    const swapCallParams = SmartWalletRouter.buildSmartWalletTrade(
      trade,
      options,
    );

    const externalOps = swapCallParams.externalUserOps;
    const { domain, types, values } = swapCallParams.smartWalletTypedData;

    const windowClient = await connector?.getClient?.({
      chainId: inputAsset.chainId,
    });

    if (externalOps.length > 0) {
      for (const externalOp of externalOps) {
        await SmartWalletRouter.sendTransactionFromRelayer(
          inputAsset.chainId,
          externalOp as never,
          {
            externalClient: windowClient as any,
          },
        );
      }
    }
    await signTypedDataAsync({
      account: address,
      domain,
      types,
      message: values,
      primaryType: "ECDSAExec",
    })
      .then(async (signature) => {
        toggleSubmittedModal();
        setPendingTransaction(true);

        handleTypeInput("");
        handleTypeOutput("");

        const signatureEncoded = defaultAbiCoder.encode(
          ["uint256", "bytes"],
          [chainId, signature],
        );

        if (values.nonce === 0n) {
          const walletDeploymentOp =
            await SmartWalletRouter.encodeWalletCreationOp(
              [address],
              Deployments[inputAsset.chainId].ECDSAWalletFactory as any,
            );

          await SmartWalletRouter.sendTransactionFromRelayer(
            inputAsset.chainId,
            walletDeploymentOp as any,
          );
        }
        const tradeEncoded = await SmartWalletRouter.encodeSmartRouterTrade(
          [values.userOps, values.allowanceOp, signatureEncoded as any],
          smartWalletDetails?.address,
          inputAsset.chainId,
        );

        if (
          swapCallParams.config.SmartWalletTradeType ===
          RouterTradeType.SmartWalletTradeWithPermit2
        ) {
          return await SmartWalletRouter.sendTransactionFromRelayer(
            inputAsset.chainId,
            tradeEncoded as any,
          );
        }
        return await SmartWalletRouter.sendTransactionFromRelayer(
          inputAsset.chainId,
          tradeEncoded as any,
          {
            externalClient: windowClient as any,
          },
        );
      })
      .catch((err: unknown) => {
        setPendingTransaction(false);
        toggleRejectedModal();
        if (err instanceof UserRejectedRequestError) {
          throw new TransactionRejectedRpcError(Error("Transaction rejected"));
        }
        throw new Error(`Swap Failed ${err as string}`);
      });
  }, [
    address,
    signTypedDataAsync,
    connector,
    inAllowance,
    outAllowance,
    smartWalletDetails,
    chainId,
    feeCurrency,
    onUserInput,
    trade,
  ]);

  return (
    <>
      <div className="grid h-full grid-rows-9">
        <div className="row-span-2 " />
        <div className="z-10 row-span-4 -m-12 flex h-full items-center justify-center gap-8">
          <div className=" my-auto flex w-full justify-center gap-8">
            <div className=" grid grid-cols-8 gap-9">
              <div className="col-span-3">
                <BridgeModalContainer>
                  <div className="flex justify-between px-2">
                    <div className="text-[rgb(220,248,253)]">Swap</div>
                    <CloseIcon color="rgb(240, 240, 240)" />
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
                  <TradeDetails
                    trade={trade}
                    inputAmounts={input}
                    outputAmounts={output}
                    feeAmounts={fees}
                  />
                  {/* <ButtonWrapper>
                    <PrimaryButton
                      className="bg-[rgb(154,200,255)]! w-full items-center justify-center rounded-[14px] py-4 font-semibold hover:bg-[rgb(164,210,255)]"
                      disabled={!address}
                      onClick={toggleConfirmationModal}
                      variant="secondary"
                    >
                      {pendingTransaction
                        ? "Swap Processing"
                        : !address
                          ? "Connect Wallet"
                          : typedValue !== ""
                            ? `Swap ${typedValue} ${inputCurrency?.symbol}`
                            : "Enter An Amount"}
                    </PrimaryButton>
                  </ButtonWrapper> */}
                  <SwapButton
                    trade={trade}
                    inAllowance={inAllowance}
                    outAllowance={outAllowance}
                    smartWalletDetails={smartWalletDetails}
                    fees={fees}
                  />
                </BridgeModalContainer>
              </div>
              <div className="col-span-5 flex  w-full justify-end">
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
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-5" />
        {trade && fees?.fees && inputCurrency && (
          <TransactionFlowModals
            trade={trade}
            asset={inputCurrency}
            fees={fees.fees}
            buttonState={"Transaction"}
            text={"Swap"}
            inAllowance={inAllowance}
            outAllowance={outAllowance}
            smartWalletDetails={smartWalletDetails}
            executeTx={swap}
          />
        )}
        <GlowSecondary />
      </div>
    </>
  );
};

export default SwapModal;
