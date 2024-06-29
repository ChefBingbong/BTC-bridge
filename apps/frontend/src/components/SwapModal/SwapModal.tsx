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
  TransactionReceipt,
  TransactionRejectedRpcError,
  UserRejectedRequestError,
} from "viem";
import { defaultAbiCoder } from "@ethersproject/abi";
import { useSwapState, useSwapctionHandlers } from "~/state/swap/hooks";
import { Field } from "~/state/swap/actions";
import { useCurrency, useCurrencyWithId } from "~/hooks/useCurrency";
import { CurrencyInputField } from "./CurrencyInputField";

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
  const chainId = useChainId();
  const { signTypedDataAsync } = useSignTypedData();

  const {
    typedValue,
    independentField,
    inputCurrencyId,
    feeCurrencyId,
    outputCurrencyId,
  } = useSwapState();

  const inputCurrency = useCurrency(inputCurrencyId);
  const feeCurrency = useCurrency(feeCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);

  const { onUserInput, onCurrencySelection, onSwitchTokens } =
    useSwapctionHandlers();

  const handleTypeInput = useCallback(
    (value: string) => onUserInput(Field.INPUT, value),
    [onUserInput],
  );
  const handleTypeOutput = useCallback(
    (value: string) => onUserInput(Field.OUTPUT, value),
    [onUserInput],
  );

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

  const handleToggleSwapState = useCallback(() => {
    onSwitchTokens();
  }, [onSwitchTokens]);

  const amount = useMemo(
    () =>
      inputCurrency && typedValue
        ? CurrencyAmount.fromRawAmount(
            inputCurrency,
            Number(typedValue ?? 1) * 10 ** inputCurrency?.decimals ?? 18,
          )
        : undefined,
    [typedValue, inputCurrency],
  );

  const { data: smartWalletDetails, refetch } = useQuery({
    queryKey: ["smartWalletDetails", address, inputCurrency?.chainId ?? 0],
    queryFn: async () => {
      if (!address || !inputCurrency?.chainId) return;
      return SmartWalletRouter.getUserSmartWalletDetails(
        address,
        inputCurrency.chainId,
      );
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(address && inputCurrency?.chainId),
  });

  const { data: allowance, refetch: refetchAlloance } = useQuery({
    queryKey: [
      "allowance-query",
      inputCurrency?.symbol,
      feeCurrency?.symbol,
      address,
      inputCurrency?.chainId,
    ],
    queryFn: async () => {
      if (!inputCurrency?.chainId || !address || !amount || !feeCurrency)
        return undefined;

      return SmartWalletRouter.getContractAllowance(
        [inputCurrency?.wrapped?.address, feeCurrency?.wrapped?.address],
        address,
        inputCurrency.chainId,
        amount.quotient,
      );
    },

    refetchInterval: 20000,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(
      address && inputCurrency?.chainId && amount && feeCurrency?.chainId,
    ),
  });

  const { data: trade, isLoading: isFetchingTrade } = useSmartRouterBestTrade({
    toAsset: outputCurrency,
    fromAsset: inputCurrency,
    chainId: inputCurrency?.chainId,
    account: address,
    amount: amount,
  });

  const isTypingInput = independentField === Field.INPUT;
  const inputValue = useMemo(
    () =>
      typedValue &&
      (isTypingInput ? typedValue : formatAmount(trade?.inputAmount) || ""),
    [typedValue, isTypingInput, trade],
  );
  const outputValue = useMemo(
    () =>
      typedValue &&
      (isTypingInput ? formatAmount(trade?.outputAmount) || "" : typedValue),
    [typedValue, isTypingInput, trade],
  );
  const inputLoading = typedValue ? !isTypingInput && isFetchingTrade : false;
  const outputLoading = typedValue ? isTypingInput && isFetchingTrade : false;

  // console.log(outputValue);
  const { data: fees, isFetching: isFetchingFees } = useQuery({
    queryKey: [
      "fees-query",
      inputCurrency?.symbol,
      outputCurrency?.symbol,
      feeCurrency?.symbol,
    ],
    queryFn: async () => {
      if (!trade || !feeCurrency || !inputCurrency || !outputCurrency)
        return undefined;

      return SmartWalletRouter.estimateSmartWalletFees({
        feeCurrency: feeCurrency?.symbol,
        inputCurrency: inputCurrency,
        outputCurrency: outputCurrency,
      });
    },

    refetchInterval: 10000,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(inputCurrency && outputCurrency && feeCurrency && trade),
  });
  console.log(fees);

  const swapCallParams = useMemo(() => {
    if (
      !trade ||
      !inputCurrency ||
      !feeCurrency ||
      !outputCurrency ||
      !allowance ||
      !smartWalletDetails ||
      !address
    )
      return undefined;

    const options = getSmartWalletOptions(
      address,
      true,
      allowance,
      smartWalletDetails as never,
      inputCurrency.chainId,
      {
        inputAsset: inputCurrency.wrapped?.address,
        feeAsset: feeCurrency.wrapped?.address,
        outputAsset: outputCurrency.wrapped?.address,
      },
      RouterTradeType.SmartWalletTradeWithPermit2,
    );
    return SmartWalletRouter.buildSmartWalletTrade(trade, options);
  }, [
    trade,
    address,
    allowance,
    smartWalletDetails,
    inputCurrency,
    feeCurrency,
    outputCurrency,
  ]);

  const swap = useCallback(async () => {
    if (!swapCallParams || !address || !allowance || !inputCurrency) return;

    const windowClient = await connector?.getClient?.({
      chainId: inputCurrency.chainId,
    });
    const externalOps = swapCallParams.externalUserOps;

    if (externalOps.length > 0) {
      for (const externalOp of externalOps) {
        await SmartWalletRouter.sendTransactionFromRelayer(
          inputCurrency.chainId,
          externalOp as never,
          {
            externalClient: windowClient as any,
          },
        );
      }
    }
    const { domain, types, values } = swapCallParams.smartWalletTypedData;
    console.log(values, swapCallParams.smartWalletTypedData);
    await signTypedDataAsync({
      account: address,
      domain,
      types,
      message: values,
      primaryType: "ECDSAExec",
    })
      .then(async (signature) => {
        const signatureEncoded = defaultAbiCoder.encode(
          ["uint256", "bytes"],
          [chainId, signature],
        );

        if (values.nonce === 0n) {
          const walletDeploymentOp =
            await SmartWalletRouter.encodeWalletCreationOp(
              [address],
              Deployments[inputCurrency.chainId].ECDSAWalletFactory as any,
            );

          const response = await SmartWalletRouter.sendTransactionFromRelayer(
            inputCurrency.chainId,
            walletDeploymentOp as any,
          );
          console.log(response);
        }
        const tradeEncoded = await SmartWalletRouter.encodeSmartRouterTrade(
          [values.userOps, values.allowanceOp, signatureEncoded as any],
          smartWalletDetails?.address,
          inputCurrency.chainId,
        );
        console.log(tradeEncoded, values);

        let response = null;
        if (
          swapCallParams.config.SmartWalletTradeType ===
          RouterTradeType.SmartWalletTradeWithPermit2
        ) {
          response = await SmartWalletRouter.sendTransactionFromRelayer(
            inputCurrency.chainId,
            tradeEncoded as any,
          );
        } else {
          response = await SmartWalletRouter.sendTransactionFromRelayer(
            inputCurrency.chainId,
            tradeEncoded as any,
            {
              externalClient: windowClient as any,
            },
          );
        }
        console.log(response);
        onUserInput(Field.INPUT, "");
        refetch();

        return response as TransactionReceipt;
      })
      .catch((err: unknown) => {
        console.log(err);
        if (err instanceof UserRejectedRequestError) {
          throw new TransactionRejectedRpcError(Error("Transaction rejected"));
        }
        throw new Error(`Swap Failed ${err as string}`);
      });
  }, [
    swapCallParams,
    address,
    signTypedDataAsync,
    inputCurrency?.chainId,
    allowance,
    smartWalletDetails,
  ]);
  return (
    <>
      <div className="   mt-[85px] flex  items-center justify-center">
        <div className="z-10 flex w-[70%] items-center justify-center gap-8">
          <BridgeModalContainer>
            {/* <CurrencySelectPopOver
            setShowProvidersPopOver={setShowProvidersPopOver}
            showProivdersPopOver={showProivdersPopOver}
          /> */}

            {/* <CurrencySelectPopOver
              setShowProvidersPopOver={setShowProvidersPopOver}
              showProivdersPopOver={showProivdersPopOver}
              asset={outputCurrency}
              onCurrencySelect={handleOutputSelect}
            /> */}

            <div className="flex justify-between px-2">
              <div>Swap</div>
              <CloseIcon />
              <ArrowDownContainer onClick={handleToggleSwapState}>
                <UilAngleDown className={"h-6 w-6"} />
              </ArrowDownContainer>
            </div>
            <CurrencyInputField
              currency={inputCurrency}
              onCurrencySelect={handleInputSelect}
              onTypeInput={handleTypeInput}
              inputValue={isTypingInput ? typedValue : inputValue}
            />
            <CurrencyInputField
              currency={feeCurrency}
              onCurrencySelect={handleFeeSelect}
              onTypeInput={() => null}
              inputValue={formatAmount(fees?.gasCostInBaseToken) ?? ""}
            />
            <CurrencyInputField
              currency={outputCurrency}
              onCurrencySelect={handleOutputSelect}
              onTypeInput={handleTypeOutput}
              inputValue={isTypingInput ? outputValue : typedValue}
            />

            <ButtonWrapper>
              <PrimaryButton
                className="w-full items-center justify-center rounded-[15px] py-4 font-semibold hover:bg-[rgb(229,115,157)]"
                disabled={!address}
                onClick={swap}
              >
                {!address
                  ? "Connect Wallet"
                  : typedValue !== ""
                    ? `Swap ${typedValue} ${inputCurrency?.symbol}`
                    : "Enter An Amount"}
              </PrimaryButton>
            </ButtonWrapper>
          </BridgeModalContainer>
          <TransactionsContainer>
            <div className="flex flex-col gap-1">
              <span className="font-semobold text-[18px] text-white">
                Transactions
              </span>
              <span>nothing here yet.</span>
            </div>
          </TransactionsContainer>
        </div>
      </div>
      <GlowSecondary />
    </>
  );
};

export default SwapModal;
