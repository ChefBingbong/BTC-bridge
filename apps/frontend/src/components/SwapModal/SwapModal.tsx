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
import {
  ArrowDownContainer,
  BridgeModalContainer,
  ButtonContents,
  ButtonWrapper,
  CloseIcon,
  GlowSecondary,
  InfoWrapper,
  SelectedToken,
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

  const [inputValue, setInputValue] = useState("");
  const [type, setType] = useState<"ASSET" | "FEE" | "TO" | "">("");
  const [showProivdersPopOver, setShowProvidersPopOver] =
    useState<boolean>(false);

  const [asset, setAsset] = useState<Currency | undefined>(NativeBtc.onChain());

  const [feeAsset, setFeeAsset] = useState<Currency | undefined>(undefined);
  const [toAsset, setToAsset] = useState<Currency | undefined>(undefined);
  const [activeAsset, setActiveAsset] = useState<Currency | undefined>(
    undefined,
  );

  const { balance: assetBalance } = useTokenBalance(asset?.wrapped);
  const { balance: feeAssetBalance } = useTokenBalance(toAsset?.wrapped);
  const { balance: toAssetBalance } = useTokenBalance(feeAsset?.wrapped);

  const handleAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleAssetChange = useCallback(
    (currency: Currency | undefined, type: "ASSET" | "FEE" | "TO") => {
      if (type === "ASSET") setAsset(currency);
      if (type === "TO") setToAsset(currency);
      if (type === "FEE") setFeeAsset(currency);
    },
    [],
  );

  const handleOpenCurrencyPopover = useCallback(
    (type: "ASSET" | "FEE" | "TO", activeAsset: Currency | undefined) => {
      setType(type);
      setActiveAsset(activeAsset);
      setShowProvidersPopOver(true);
    },
    [],
  );

  const handleToggleSwapState = useCallback(() => {
    const currentAsset = asset;
    const currentToAsset = toAsset;
    setAsset(currentToAsset);
    setToAsset(currentAsset);
  }, [toAsset, asset]);

  const amount = useMemo(
    () =>
      asset
        ? CurrencyAmount.fromRawAmount(
            asset,
            Number(inputValue) * 10 ** asset?.decimals ?? 18,
          )
        : undefined,
    [inputValue, asset],
  );

  const { data: smartWalletDetails, refetch } = useQuery({
    queryKey: ["smartWalletDetails", address, asset?.chainId ?? 0],
    queryFn: async () => {
      if (!address || !asset?.chainId) return;
      return SmartWalletRouter.getUserSmartWalletDetails(
        address,
        asset.chainId,
      );
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(address && asset?.chainId),
  });

  const { data: allowance, refetch: refetchAlloance } = useQuery({
    queryKey: [
      "allowance-query",
      asset?.symbol,
      feeAsset?.symbol,
      address,
      asset?.chainId,
    ],
    queryFn: async () => {
      if (!asset?.chainId || !address || !amount || !feeAsset) return undefined;

      return SmartWalletRouter.getContractAllowance(
        [asset?.wrapped?.address, feeAsset?.wrapped?.address],
        address,
        asset.chainId,
        amount.quotient,
      );
    },

    refetchInterval: 20000,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(address && asset?.chainId && amount && feeAsset?.chainId),
  });

  const { data: trade, isLoading: isFetchingTrade } = useSmartRouterBestTrade({
    toAsset: toAsset,
    fromAsset: asset,
    chainId: asset?.chainId,
    account: address,
    amount: amount,
  });
  // console.log(trade, asset?.chainId);
  const { data: fees, isFetching: isFetchingFees } = useQuery({
    queryKey: ["fees-query", asset?.symbol, toAsset?.symbol, feeAsset?.symbol],
    queryFn: async () => {
      if (!trade || !feeAsset || !asset || !toAsset) return undefined;

      return SmartWalletRouter.estimateSmartWalletFees({
        feeAsset: feeAsset?.symbol,
        inputCurrency: asset,
        outputCurrency: toAsset,
      });
    },

    refetchInterval: 10000,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(asset && toAsset && feeAsset && trade),
  });

  const swapCallParams = useMemo(() => {
    if (
      !trade ||
      !asset ||
      !feeAsset ||
      !toAsset ||
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
      asset.chainId,
      {
        inputAsset: asset.wrapped?.address,
        feeAsset: feeAsset.wrapped?.address,
        outputAsset: toAsset.wrapped?.address,
      },
      RouterTradeType.SmartWalletTradeWithPermit2,
    );
    return SmartWalletRouter.buildSmartWalletTrade(trade, options);
  }, [trade, address, allowance, smartWalletDetails, asset, feeAsset, toAsset]);

  const swap = useCallback(async () => {
    if (!swapCallParams || !address || !allowance) return;

    const windowClient = await connector?.getClient?.({
      chainId: asset.chainId,
    });
    const externalOps = swapCallParams.externalUserOps;

    if (externalOps.length > 0) {
      for (const externalOp of externalOps) {
        await SmartWalletRouter.sendTransactionFromRelayer(
          asset.chainId,
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
              Deployments[asset.chainId].ECDSAWalletFactory as any,
            );

          const response = await SmartWalletRouter.sendTransactionFromRelayer(
            asset.chainId,
            walletDeploymentOp as any,
          );
          console.log(response);
        }
        const tradeEncoded = await SmartWalletRouter.encodeSmartRouterTrade(
          [values.userOps, values.allowanceOp, signatureEncoded as any],
          smartWalletDetails?.address,
          asset.chainId,
        );
        console.log(tradeEncoded, values);

        let response = null;
        if (
          swapCallParams.config.SmartWalletTradeType ===
          RouterTradeType.SmartWalletTradeWithPermit2
        ) {
          response = await SmartWalletRouter.sendTransactionFromRelayer(
            asset.chainId,
            tradeEncoded as any,
          );
        } else {
          response = await SmartWalletRouter.sendTransactionFromRelayer(
            asset.chainId,
            tradeEncoded as any,
            {
              externalClient: windowClient as any,
            },
          );
        }
        console.log(response);
        setInputValue("");
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
    asset.chainId,
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

            <CurrencySelectPopOver
              setShowProvidersPopOver={setShowProvidersPopOver}
              showProivdersPopOver={showProivdersPopOver}
              handleAssetChange={handleAssetChange}
              activeAsset={activeAsset}
              asset={asset}
              toAsset={toAsset}
              type={type}
            />
            <div className="flex justify-between px-2">
              <div>Swap</div>
              <CloseIcon />
              <ArrowDownContainer onClick={handleToggleSwapState}>
                <UilAngleDown className={"h-6 w-6"} />
              </ArrowDownContainer>
            </div>
            <TokenAmountWrapper height="100px" marginTop={"12px"}>
              <div className="h-full flex-col items-center justify-center gap-4">
                <InfoWrapper>
                  <TokenInput
                    placeholder={"0.0"}
                    onChange={handleAmount}
                    value={inputValue}
                    required
                    type="number"
                  />

                  {!asset?.isNative && (
                    <UilCopy
                      className="ml-2 h-8 w-8 text-gray-400 hover:cursor-pointer"
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          asset?.address as string,
                        );
                      }}
                    />
                  )}
                  <TokenSelectButton
                    color={asset ? "white" : "rgb(154,200,255)"}
                    onClick={() => handleOpenCurrencyPopover("ASSET", asset)}
                  >
                    <ButtonContents>
                      <div className="jutsify-center flex flex items-center gap-1 break-words">
                        {asset && (
                          <div className="relative h-6 w-6">
                            <CurrencyLogo currency={asset} size="24px" />

                            {asset?.chainId !== 0 && (
                              <ChainLogo
                                chainId={asset.chainId}
                                style={{
                                  position: "absolute",
                                  left: "50%",
                                  top: "40%",
                                  height: "18px",
                                  width: "18px",
                                }}
                              />
                            )}
                          </div>
                        )}

                        <SelectedToken color={asset ? "grey" : "white"}>
                          {asset ? asset.symbol : "From asset"}
                        </SelectedToken>
                      </div>

                      <ChevronDown size={"25px"} color="grey" />
                    </ButtonContents>
                  </TokenSelectButton>
                </InfoWrapper>

                <div className="flex w-full justify-between gap-2  text-gray-500">
                  <div className="overflow-ellipsis text-sm">{"You spend"}</div>

                  {asset && (
                    <div className="overflow-ellipsis text-sm">{`${assetBalance} ${asset?.symbol}`}</div>
                  )}
                </div>
              </div>
            </TokenAmountWrapper>
            <TokenAmountWrapper height="100px" marginTop={"7px"}>
              <div className="h-full flex-col items-center justify-center ">
                <InfoWrapper>
                  <TokenInput
                    placeholder={"0.0"}
                    disabled
                    value={
                      fees && inputValue !== ""
                        ? Number(fees?.gasCostInBaseToken?.toExact()).toFixed(5)
                        : ""
                    }
                  />
                  {!feeAsset?.isNative && (
                    <UilCopy
                      className="ml-2 h-8 w-8 text-gray-400 hover:cursor-pointer"
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          feeAsset?.address as string,
                        );
                      }}
                    />
                  )}
                  <TokenSelectButton
                    color={feeAsset ? "white" : "rgb(154,200,255)"}
                    onClick={() => handleOpenCurrencyPopover("FEE", feeAsset)}
                  >
                    <ButtonContents>
                      <div className="jutsify-center flex flex items-center gap-1 break-words">
                        {feeAsset && (
                          <div className="relative h-6 w-6">
                            <CurrencyLogo currency={feeAsset} size="24px" />

                            {feeAsset?.chainId !== 0 && (
                              <ChainLogo
                                chainId={feeAsset.chainId}
                                style={{
                                  position: "absolute",
                                  left: "50%",
                                  top: "40%",
                                  height: "18px",
                                  width: "18px",
                                }}
                              />
                            )}
                          </div>
                        )}
                        <SelectedToken color={feeAsset ? "grey" : "white"}>
                          {feeAsset ? feeAsset.symbol : "Fee asset"}
                        </SelectedToken>
                      </div>
                      <ChevronDown size={"25px"} color="grey" />
                    </ButtonContents>
                  </TokenSelectButton>
                </InfoWrapper>

                <div className="flex w-full justify-between gap-2  text-gray-500">
                  <div className="flex items-center gap-2 overflow-ellipsis text-sm">
                    <span>{"fee cost"}</span>
                    {isFetchingFees ||
                      (isFetchingTrade && (
                        <UilSpinner
                          className={"h-5 w-5 animate-spin text-blue-600"}
                        />
                      ))}
                  </div>

                  {feeAsset && (
                    <div className="overflow-ellipsis text-sm">{`${feeAssetBalance} ${feeAsset?.symbol}`}</div>
                  )}
                </div>
              </div>
            </TokenAmountWrapper>
            <TokenAmountWrapper height="100px" marginTop={"7px"}>
              <div className="h-full flex-col items-center justify-center ">
                <InfoWrapper>
                  <TokenInput
                    placeholder={"0.0"}
                    disabled
                    value={
                      trade
                        ? Number(trade?.outputAmount?.toExact()).toFixed(5)
                        : ""
                    }
                  />
                  {!toAsset?.isNative && (
                    <UilCopy
                      className="ml-2 h-8 w-8 text-gray-400 hover:cursor-pointer"
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          toAsset?.address as string,
                        );
                      }}
                    />
                  )}

                  <TokenSelectButton
                    color={toAsset ? "white" : "rgb(154,200,255)"}
                    onClick={() => handleOpenCurrencyPopover("TO", toAsset)}
                  >
                    <ButtonContents>
                      <div className="jutsify-center flex flex items-center gap-1 break-words">
                        {toAsset && (
                          <div className="relative h-6 w-6">
                            <CurrencyLogo currency={toAsset} size="24px" />

                            {toAsset?.chainId !== 0 && (
                              <ChainLogo
                                chainId={toAsset.chainId}
                                style={{
                                  position: "absolute",
                                  left: "50%",
                                  top: "40%",
                                  height: "18px",
                                  width: "18px",
                                }}
                              />
                            )}
                          </div>
                        )}
                        <SelectedToken color={toAsset ? "grey" : "white"}>
                          {toAsset ? toAsset.symbol : "To asset"}
                        </SelectedToken>
                      </div>
                      <ChevronDown size={"25px"} color="grey" />
                    </ButtonContents>
                  </TokenSelectButton>
                </InfoWrapper>

                <div className="flex w-full justify-between gap-2  text-gray-500">
                  <div className="flex items-center gap-2 overflow-ellipsis text-sm">
                    <span>{"You spend"}</span>
                    {isFetchingTrade && (
                      <UilSpinner
                        className={"h-5 w-5 animate-spin text-blue-600"}
                      />
                    )}
                  </div>

                  {toAsset && (
                    <div className="overflow-ellipsis text-sm">{`${toAssetBalance} ${toAsset?.symbol}`}</div>
                  )}
                </div>
              </div>
            </TokenAmountWrapper>

            <ButtonWrapper>
              <PrimaryButton
                className="w-full items-center justify-center rounded-[15px] py-4 font-semibold hover:bg-[rgb(229,115,157)]"
                disabled={!address}
                onClick={swap}
              >
                {!address
                  ? "Connect Wallet"
                  : inputValue !== ""
                    ? `Swap ${inputValue} ${asset?.symbol}`
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
