// import UniswapLogoPink from "../../../public/svgs/";
// import UniswapLogo from "../../../public/svgs/assets/uniswapPink.svg";
import { UilAngleDown, UilCopy } from "@iconscout/react-unicons";
import { ERC20Token } from "@pancakeswap/sdk";
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
  InfoWrapper,
  SelectedToken,
  TokenAmountWrapper,
  TokenInput,
  TokenSelectButton,
} from "./styles";

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

  const [asset] = useState<ERC20Token | undefined>(
    new ERC20Token(
      97,
      "0x6F451Eb92d7dE92DdF6939d9eFCE6799246B3a4b",
      18,
      "BUSD",
    ),
  );
  const [feeAsset] = useState<ERC20Token | undefined>(undefined);
  const [toAsset] = useState<ERC20Token | undefined>(undefined);

  const handleAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);
  return (
    <>
      <div className=" mt-[20px] flex flex-col items-center justify-center">
        <BridgeModalContainer>
          {/* <UniswapLogoPink /> */}
          <div className="flex justify-between px-2">
            <div>Swap</div>
            <CloseIcon />
            <ArrowDownContainer>
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
                    className="ml-2 h-8 w-8 text-gray-500 hover:cursor-pointer"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        asset?.address as string,
                      );
                    }}
                  />
                )}
                <TokenSelectButton
                  color={asset ? "white" : "rgb(219,105,147)"}
                  onClick={() => null}
                >
                  <ButtonContents>
                    <div className="jutsify-center flex flex items-center gap-1 break-words">
                      {asset && (
                        <div className="relative h-6 w-6">
                          {/* <Icon
                            chainName={asset.Icon as string}
                            className="absolute h-6 w-6"
                          /> */}

                          {/* <Icon
                            chainName={
                              ChainIdToRenChain[asset.chainId] as string
                            }
                            className="absolute left-[50%] top-[45%] h-[14px] w-[14px] bg-black"
                          /> */}
                        </div>
                      )}

                      <SelectedToken initialWidth={asset ? true : false}>
                        {asset ? asset.symbol : "From asset"}
                      </SelectedToken>
                    </div>

                    <ChevronDown size={"25px"} />
                  </ButtonContents>
                </TokenSelectButton>
              </InfoWrapper>

              <div className="flex w-full justify-between gap-2  text-gray-500">
                <div className="overflow-ellipsis text-sm">{"You spend"}</div>

                {/* {asset && (
                  <div className="overflow-ellipsis text-sm">{`${formatAssetBalance} ${asset?.shortName}`}</div>
                )} */}
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
                    className="ml-2 h-8 w-8 text-gray-500 hover:cursor-pointer"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        feeAsset?.address as string,
                      );
                    }}
                  />
                )}
                <TokenSelectButton
                  color={feeAsset ? "white" : "rgb(219,105,147)"}
                  onClick={() => null}
                >
                  <ButtonContents>
                    <div className="jutsify-center flex flex items-center gap-1 break-words">
                      {feeAsset && (
                        <div className="relative h-6 w-6">
                          {/* <Icon
                            chainName={feeAsset.Icon as string}
                            className="absolute h-6 w-6"
                          /> */}

                          {/* <Icon
                            chainName={
                              ChainIdToRenChain[feeAsset.chainId] as string
                            }
                            className="absolute left-[50%] top-[45%] h-[14px] w-[14px] bg-black"
                          /> */}
                        </div>
                      )}
                      <SelectedToken initialWidth={!feeAsset ? true : false}>
                        {feeAsset ? feeAsset.symbol : "Fee asset"}
                      </SelectedToken>
                    </div>
                    <ChevronDown size={"25px"} />
                  </ButtonContents>
                </TokenSelectButton>
              </InfoWrapper>

              <div className=" flex w-full justify-between gap-2 text-gray-500">
                {/* {feeAsset && (
                  <div className="overflow-ellipsis text-sm">{`${formatFeeAssetBalance} ${feeAsset?.shortName}`}</div>
                )} */}
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
                    className="ml-2 h-8 w-8 text-gray-500 hover:cursor-pointer"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        toAsset?.address as string,
                      );
                    }}
                  />
                )}
                {/* <div className="h-full flex-col items-center justify-center gap-4"> */}
                <TokenSelectButton
                  color={toAsset ? "white" : "rgb(219,105,147)"}
                  onClick={() => null}
                >
                  <ButtonContents>
                    <div className="jutsify-center flex flex items-center gap-1 break-words">
                      {toAsset && (
                        <div className="relative h-6 w-6">
                          {/* <Icon
                            chainName={toAsset.Icon as string}
                            className="absolute h-6 w-6"
                          /> */}

                          {/* <Icon
                            chainName={
                              ChainIdToRenChain[ChainId.ARBITRUM_ONE] as string
                            }
                            className="absolute left-[50%] top-[45%] h-[14px] w-[14px] bg-black"
                          /> */}
                        </div>
                      )}
                      <SelectedToken initialWidth={toAsset ? true : false}>
                        {toAsset ? toAsset.symbol : "To asset"}
                      </SelectedToken>
                    </div>
                    <ChevronDown size={"25px"} />
                  </ButtonContents>
                </TokenSelectButton>
              </InfoWrapper>

              <div className=" flex w-full justify-between gap-2 text-gray-500">
                {/* {toAsset && (
                  <div className="overflow-ellipsis text-sm">{`${formatToAssetBalance} ${toAsset?.shortName}`}</div>
                )} */}
              </div>
            </div>
          </TokenAmountWrapper>

          <ButtonWrapper>
            <PrimaryButton
              className="w-full items-center justify-center rounded-2xl py-4"
              disabled={false}
              onClick={() => null}
            >
              Enter An Amount
            </PrimaryButton>
          </ButtonWrapper>
        </BridgeModalContainer>
      </div>
      {/* <GlowSecondary /> */}
    </>
  );
};

export default SwapModal;
