import {
  Deployments,
  FeeResponse,
  RouterTradeType,
  SmartWalletDetails,
  SmartWalletRouter,
  WalletAllownceDetails,
} from "@btc-swap/router-sdk";
import { defaultAbiCoder } from "@ethersproject/abi";
import { CurrencyAmount, TradeType } from "@pancakeswap/sdk";
import { SmartRouterTrade } from "@pancakeswap/smart-router";
import { Flex, Text } from "@pancakeswap/uikit";
import { useCallback, useEffect, useMemo } from "react";
import { TransactionRejectedRpcError, UserRejectedRequestError } from "viem";
import {
  useAccount,
  useChainId,
  useConnect,
  useSignTypedData,
  useSwitchChain,
} from "wagmi";
import { LoadingBubble } from "~/components/SwapModal/styles";
import { useTransactionFlow } from "~/context/useTransactionFlowState";
import { useTokenBalance } from "~/hooks/useBalance";
import { useSwapCurrencyOrder } from "~/hooks/useSwapCurrencies";
import { useSwapState } from "~/state/swap/hooks";
import { getSmartWalletOptions } from "~/utils/getSmartWalletOptions";
import { formatAmount } from "~/utils/misc";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { ButtonWrapper } from "~/components/SwapModal/styles";
import BigNumber from "bignumber.js";
import TransactionFlowModals from "~/components/TxConfirmationModalFlow";

const SwapButton = ({
  trade,
  inAllowance,
  outAllowance,
  smartWalletDetails,
  fees,
  input,
  output,
}: {
  trade: SmartRouterTrade<TradeType>;
  inAllowance: WalletAllownceDetails;
  outAllowance: WalletAllownceDetails;
  smartWalletDetails: SmartWalletDetails;
  input: any;
  output: any;
  fees: FeeResponse;
}) => {
  const chainId = useChainId();
  const { typedValue } = useSwapState();

  const { inputCurrency, feeCurrency, outputCurrency } =
    useSwapCurrencyOrder().tradeCurrencies;
  const { address, isConnecting, connector } = useAccount();
  const { connectAsync, connectors, error: connectionError } = useConnect();
  const {
    isPending: chainPending,
    isError: chainError,
    switchChainAsync,
  } = useSwitchChain();
  const { signTypedDataAsync, error: swapError } = useSignTypedData();

  const {
    togglePendingModal,
    toggleRejectedModal,
    toggleSubmittedModal,
    toggleTransactionFailedModal,
    toggleConfirmationModal,
    pendingTransaction,
    pending,
    setPendingTransaction,
  } = useTransactionFlow();

  const { balance: inputCurrencyBalance } = useTokenBalance(
    inputCurrency?.wrapped,
  );
  const { balance: feeCurrencyBalance } = useTokenBalance(feeCurrency?.wrapped);

  const enableConnection = useCallback(async () => {
    if (!connectors[0]) return;
    try {
      const connected = await connectAsync({ connector: connectors[0] });
      return connected;
    } catch (error) {
      console.error(error);
    }
  }, [connectors, connectAsync]);

  useEffect(() => {
    console.log("making iitt2");

    if (swapError || chainError || connectionError) {
      console.log("making iitt2");
      if (pending) togglePendingModal();
      toggleTransactionFailedModal();
    }
  }, [
    chainError,
    swapError,
    connectionError,
    toggleTransactionFailedModal,
    togglePendingModal,
  ]);

  const connectButtonText = useMemo(() => {
    if (!address) return "Connect Wallet";
    if (isConnecting) return "Waiting For Conection";
    if (connectionError) return "Failed To Connect";
    return "Conect Wallet";
  }, [isConnecting, address, connectionError]);

  const swap = useCallback(async () => {
    if (!trade || !smartWalletDetails) return;

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
    const windowClient = await connector?.getClient?.({
      chainId: inputAsset.chainId,
    });
    const externalOps = swapCallParams.externalUserOps;
    const { domain, types, values } = swapCallParams.smartWalletTypedData;

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
    setPendingTransaction,
    connector,
    inAllowance,
    outAllowance,
    smartWalletDetails,
    chainId,
    feeCurrency,
    trade,
    togglePendingModal,
  ]);

  const needsToSwitchChain = useMemo(() => {
    if (!inputCurrency || !feeCurrency || !inAllowance) return false;

    const currencyAmount = new BigNumber(typedValue).shiftedBy(
      inputCurrency?.decimals,
    );
    const feeCurrencyAmount = new BigNumber(fees.gasCostInQuoteToken).shiftedBy(
      feeCurrency?.decimals,
    );

    const inputAllowanceRequired = Boolean(
      Number(inAllowance.allowance) < currencyAmount.toNumber(),
    );
    const outputAllowanceRequired = Boolean(
      Number(outAllowance.allowance) < feeCurrencyAmount.toNumber(),
    );
    return (
      inputAllowanceRequired ||
      (outputAllowanceRequired && chainId !== inputCurrency?.chainId)
    );
  }, [
    inputCurrency,
    feeCurrency,
    inAllowance,
    outAllowance,
    typedValue,
    chainId,
    fees,
  ]);

  const switchChainTextText = useMemo(() => {
    if (!chainPending) return "Switch Networks";
    if (chainError) return "Failed to Swicth Networks";
    return "Switch Networks";
  }, [chainPending, chainError]);

  const swapButtonText = useMemo(() => {
    const inputBal = Number(inputCurrencyBalance);
    const feeBal = Number(feeCurrencyBalance);

    if (inputBal < Number(typedValue)) return "Insufficient Balance";
    if (feeBal < fees.gasCostInQuoteToken) return "Insufficient Fee Balance";
    if (swapError) return "Swap Failed!.";
    if (input?.inputLoading || output?.outputLoading)
      return "Fetching Best Price";
    if (pendingTransaction) return "Processing Trade";
    if (!inputCurrency) return "Select a Token To Swap";
    if (!outputCurrency) return "Select a token to Buy";
    if (inputCurrency && outputCurrency && !trade && typedValue === "") {
      return "Enter an Amount To Swap";
    }
    if (trade) return "Execute Swap";
    return "Swap";
  }, [
    fees,
    trade,
    typedValue,
    swapError,
    pendingTransaction,
    inputCurrency,
    outputCurrency,
    inputCurrencyBalance,
    feeCurrencyBalance,
  ]);

  if (!address)
    return (
      <ButtonWrapper>
        <PrimaryButton
          className="bg-[rgb(154,200,255)]! w-full items-center justify-center rounded-[14px] py-4 font-semibold hover:bg-[rgb(164,210,255)]"
          disabled={address || isConnecting}
          onClick={enableConnection}
          variant="secondary"
        >
          <Flex justifyContent="center" alignItems="center">
            <Text px="4px">{connectButtonText}</Text>
            {isConnecting && <LoadingBubble />}
          </Flex>
        </PrimaryButton>
      </ButtonWrapper>
    );

  if (needsToSwitchChain)
    return (
      <ButtonWrapper>
        <PrimaryButton
          className="bg-[rgb(154,200,255)]! w-full items-center justify-center rounded-[14px] py-4 font-semibold hover:bg-[rgb(164,210,255)]"
          disabled={chainError || chainPending}
          onClick={() =>
            switchChainAsync({
              chainId: inputCurrency?.chainId,
              connector: connectors[0],
            })
          }
          variant="secondary"
        >
          <Flex justifyContent="center" alignItems="center">
            <Text px="4px">{switchChainTextText}</Text>
          </Flex>
        </PrimaryButton>
      </ButtonWrapper>
    );

  return (
    <>
      <TransactionFlowModals
        trade={trade}
        asset={inputCurrency}
        fees={fees}
        buttonState={"Transaction"}
        text={"Swap"}
        inAllowance={inAllowance}
        outAllowance={outAllowance}
        smartWalletDetails={smartWalletDetails}
        executeTx={swap}
      />

      <ButtonWrapper>
        <PrimaryButton
          className="bg-[rgb(154,200,255)]! w-full items-center justify-center rounded-[14px] py-4 font-semibold hover:bg-[rgb(164,210,255)]"
          disabled={!trade || !smartWalletDetails}
          onClick={toggleConfirmationModal}
          variant="secondary"
        >
          <Flex justifyContent="center" alignItems="center">
            <Text px="4px">{swapButtonText}</Text>
            {pendingTransaction && <LoadingBubble />}
          </Flex>
        </PrimaryButton>
      </ButtonWrapper>
    </>
  );
};

export default SwapButton;
