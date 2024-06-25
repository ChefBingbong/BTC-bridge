// import UniswapLogoPink from "../../../public/svgs/";
// import UniswapLogo from "../../../public/svgs/assets/uniswapPink.svg";
import { UilAngleDown, UilCopy } from "@iconscout/react-unicons";
import { Currency, ERC20Token } from "@pancakeswap/sdk";
import type React from "react";
import { useCallback, useState } from "react";
import { ChevronDown } from "react-feather";
import PrimaryButton from "../Button/PrimaryButton/PrimaryButton";
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
import { CurrencySelectPopOver } from "./CurrencySelectPopOver";
import { useCurrency } from "~/hooks/useCurrency";
import { CurrencyLogo } from "../CurrencyLogo/CurrencyLogo";
import { useTokenBalance } from "~/hooks/useBalance";

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
  const [swapState, setSwapState] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [type, setType] = useState<"ASSET" | "FEE" | "TO" | "">("");
  const [showProivdersPopOver, setShowProvidersPopOver] =
    useState<boolean>(false);

  const [asset, setAsset] = useState<ERC20Token | undefined>(
    new ERC20Token(
      97,
      "0x6F451Eb92d7dE92DdF6939d9eFCE6799246B3a4b",
      18,
      "BUSD",
    ),
  );

  const [feeAsset, setFeeAsset] = useState<ERC20Token | undefined>(undefined);
  const [toAsset, setToAsset] = useState<ERC20Token | undefined>(undefined);
  const [activeAsset, setActiveAsset] = useState<ERC20Token | undefined>(
    undefined,
  );

  const { balance: assetBalance } = useTokenBalance(asset);
  const { balance: feeAssetBalance } = useTokenBalance(toAsset);
  const { balance: toAssetBalance } = useTokenBalance(feeAsset);

  const handleAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleAssetChange = useCallback(
    (currency: ERC20Token, type: "ASSET" | "FEE" | "TO") => {
      if (type === "ASSET") setAsset(currency);
      if (type === "TO") setToAsset(currency);
      if (type === "FEE") setFeeAsset(currency);
    },
    [],
  );

  const handleOpenCurrencyPopover = useCallback(
    (type: "ASSET" | "FEE" | "TO", activeAsset: ERC20Token) => {
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
  return (
    <>
      <div className="   mt-[50px] flex  items-center justify-center">
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
            <TokenAmountWrapper
              height={swapState === true ? "100px" : "70px"}
              marginTop={"12px"}
              marginBottom={"0px"}
              borderTrue={true}
            >
              <div className="h-full flex-col items-center justify-center gap-4">
                <InfoWrapper>
                  <TokenInput
                    placeholder={"0.0"}
                    onChange={handleAmount}
                    value={inputValue}
                    required
                    type="number"
                  />

                  {asset && (
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
                          </div>
                        )}

                        <SelectedToken
                          initialWidth={asset ? true : false}
                          color={asset ? "grey" : "white"}
                        >
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
            <TokenAmountWrapper
              height={swapState === false ? "100px" : "100px"}
              marginTop={"7px"}
              marginBottom={"0px"}
              borderTrue={false}
            >
              <div className="h-full flex-col items-center justify-center ">
                <InfoWrapper>
                  <TokenInput placeholder={"0.0"} disabled value={""} />
                  {feeAsset && (
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
                          </div>
                        )}
                        <SelectedToken
                          initialWidth={!feeAsset ? true : false}
                          color={feeAsset ? "grey" : "white"}
                        >
                          {feeAsset ? feeAsset.symbol : "Fee asset"}
                        </SelectedToken>
                      </div>
                      <ChevronDown size={"25px"} color="grey" />
                    </ButtonContents>
                  </TokenSelectButton>
                </InfoWrapper>

                <div className="flex w-full justify-between gap-2  text-gray-500">
                  <div className="overflow-ellipsis text-sm">{"Fee Asset"}</div>

                  {feeAsset && (
                    <div className="overflow-ellipsis text-sm">{`${feeAssetBalance} ${feeAsset?.symbol}`}</div>
                  )}
                </div>
              </div>
            </TokenAmountWrapper>
            <TokenAmountWrapper
              height={swapState === false ? "100px" : "100px"}
              marginTop={"7px"}
              marginBottom={"0px"}
              borderTrue={false}
            >
              <div className="h-full flex-col items-center justify-center ">
                <InfoWrapper>
                  <TokenInput placeholder={"0.0"} disabled value="" />
                  {toAsset && (
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
                          </div>
                        )}
                        <SelectedToken
                          initialWidth={toAsset ? true : false}
                          color={toAsset ? "grey" : "white"}
                        >
                          {toAsset ? toAsset.symbol : "To asset"}
                        </SelectedToken>
                      </div>
                      <ChevronDown size={"25px"} color="grey" />
                    </ButtonContents>
                  </TokenSelectButton>
                </InfoWrapper>

                <div className="flex w-full justify-between gap-2  text-gray-500">
                  <div className="overflow-ellipsis text-sm">{"You spend"}</div>

                  {toAsset && (
                    <div className="overflow-ellipsis text-sm">{`${toAssetBalance} ${toAsset?.symbol}`}</div>
                  )}
                </div>
              </div>
            </TokenAmountWrapper>

            <ButtonWrapper>
              <PrimaryButton
                className="w-full items-center justify-center rounded-[20px] py-4 font-semibold hover:bg-[rgb(229,115,157)]"
                disabled={false}
                onClick={() => null}
              >
                Enter An Amount
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
