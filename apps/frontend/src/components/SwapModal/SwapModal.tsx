// import UniswapLogoPink from "../../../public/svgs/";
// import UniswapLogo from "../../../public/svgs/assets/uniswapPink.svg";
import { UilAngleDown, UilCopy } from "@iconscout/react-unicons";
import { ERC20Token } from "@pancakeswap/sdk";
import type React from "react";
import { useCallback, useState } from "react";
import { ChevronDown, Settings } from "react-feather";
import styled from "styled-components";
import PrimaryButton from "../Button/PrimaryButton/PrimaryButton";

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

export const GlowSecondary = styled.div`
  position: absolute;
  top: 20%;
  left: 41%;
  //   bottom: 0;
  background: rgb(254, 215, 155);
  background: radial-gradient(
    circle,
    rgba(254, 215, 155, 1) 93%,
    rgba(29, 138, 191, 0) 97%
  );
  filter: blur(100px);
  z-index: -10;
  max-width: 300px;
  width: 50%;
  height: 50%;
`;
export const TokenAmountWrapper = styled.div`
  // width: 100%;
  height: ${(props: any) => props.height};
  background: rgb(248, 240, 255);
  border: 1px solid rgb(184, 152, 233);
  border-radius: 15px;
  margin-top: ${(props: any) => props.marginTop};
  padding-left: 15px;
  padding-right: 20px;

  &:hover {
    border: 1px solid rgb(184, 152, 233);
  }
`;

export const TokenAmount = styled.div`
  font-family: "Open Sans", sans-serif;
  height: 100%;
  font-size: ${(props: any) => props.size};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  float: ${(props: any) => props.float};
  color: White;
  line-height: ${(props: any) => props.lineHeight};
  margin-left: 5px;
`;

export const ImgWrapper = styled.div`
  padding-top: ${(props: any) => props.padding};
  padding-bottom: ${(props: any) => props.paddingBottom};
  display: flex;
  align-items: center;
  justify-content: center;
  float: ${(props: any) => props.float};
`;

export const ErrorText = styled.div`
  position: absolute;
  left: 5%;
  top: 3%;
  color: #adadad;
  font-size: 18px;
`;

export const CloseIcon = styled(Settings)`
  position: absolute;
  left: 91%;
  top: 3%;
  cursor: pointer;
  color: White;
  width: 20px;
  color: white;
`;

export const UniswapIcon = styled.img`
  position: absolute;
  left: 4%;
  top: 4%;
  cursor: pointer;
  color: White;
  width: 23px;
  color: #adadad;
`;

export const ArrowDownContainer = styled.div`
  position: absolute;
  top: 30%;
  left: 45%;
  background-color: rgb(214, 182, 263);
  border: 5px solid rgb(184, 152, 233);
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`;

export const Button = styled.div`
  height: 55px;
  width: 100%;
  background: ${(props: any) =>
    props.insufficentBalance
      ? "#d6454f"
      : props.disabled
        ? "rgb(36, 39, 54)"
        : "rgb(95,111,201)"};
  border-radius: 20px;
  text-align: center;
  line-height: 55px;
  font-size: 18px;
  color: ${(props: any) =>
    props.insufficentBalance
      ? "white"
      : props.disabled
        ? "rgb(67, 92, 112)"
        : "white"};
  margin-bottom: 5px;

  &:hover {
    cursor: pointer;
    background: ${(props: any) =>
      props.insufficentBalance
        ? "#d6454f"
        : props.disabled
          ? "rgb(36, 39, 54)"
          : "rgb(136,152,244)"};
  }
`;

export const ButtonWrapper = styled.div`
  font-family: "Open Sans", sans-serif;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const DisclaimerContainer = styled.div`
  font-family: "Open Sans", sans-serif;
  margin-top: 70px;
  width: 100%;
  height: 30px;
  font-size: 15px;
  // background: White;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adadad;
  font-weight: bold;
`;

export const InfoWrapper = styled.div`
  display: flex;
  padding-top: 1rem;
  padding-bottom: 0.4rem;

  justify-content: space-between;
  flex-flow: row nowrap;
  align-items: center;
  // background: white;
`;

export const TokenInput = styled.input`
  font-family: "Inter custom", sans-serif;
  width: 100%;
  background: transparent;
  border: none;
  font-size: 30px;
  color: #adadad;
  outline: none;
`;

export const TokenSelectButton = styled.div`
  font-family: "Open Sans", sans-serif;
  display: flex;
  align-items: center;
  background-color: ${(props: any) => props.color};
  color: rgb(255, 255, 255);
  cursor: pointer;
  border: 1px solid rgb(219, 105, 147);
  border-radius: 16px;
  box-shadow: ${(props: any) =>
    `rgb(0 0 0 / ${props.color === "white" ? "8%" : "20%"}) 0px 6px 10px`};
  outline: none;
  user-select: none;
  //   border: none;
  font-size: 24px;
  font-weight: 500;
  height: 2.4rem;
  // width: 100%;
  // width: 100%;
  padding: 0px 8px;
  -webkit-box-pack: justify;
  justify-content: space-between;
  margin-left: 6px;
  visibility: visible;
`;
export const SelectedTokenContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 0px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
`;

export const TokenImg = styled.img`
  width: 24px;
  height: 24px;
  background: radial-gradient(
    white 50%,
    rgba(255, 255, 255, 0) calc(75% + 1px),
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 50%;
  box-shadow: white 0px 0px 1px;
  border: 0px solid rgba(255, 255, 255, 0);
  margin-right: 5px;
`;

export const SelectedToken = styled.span`
  display: flex;
  margin: 0px 0.25rem;
  font-size: 18px;
  width: max-content;
`;

export const ChevronDownImg = styled.img`
  margin: 0px 0.25rem 0px 0.35rem;
  height: 35%;
`;

export const ButtonContents = styled.span`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  width: 100%;
`;

export const BridgeModalContainer = styled.div`
  max-width: 480px;
  color: White;
  background-color: rgb(184, 152, 233);
  text-align: right;
  padding: 12px 12px;
  //   border: 1px solid rgb(204, 182, 253);
  border-radius: 20px;
  box-shadow:
    3px 20px 20px rgba(139, 114, 176, 0.1),
    10px 20px 20px rgba(139, 114, 176, 0.1),
    0 10px 30px rgba(139, 114, 176, 0.4);

  margin: 30px auto 0;
  transition: height 3s ease-out;
  position: relative;
`;

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
