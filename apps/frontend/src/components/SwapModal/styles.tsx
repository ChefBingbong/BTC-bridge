import styled, { css, keyframes } from "styled-components";
import { Settings } from "react-feather";
import { Flex } from "@pancakeswap/uikit";

export const GlowSecondary = styled.div`
  position: absolute;
  top: 25%;
  left: 35%;
  //   bottom: 0;
  background: rgb(254, 215, 155);
  background: radial-gradient(
    circle,
    rgba(254, 215, 155, 1) 93%,
    rgba(29, 138, 191, 0) 97%
  );
  filter: blur(135px);
  z-index: 1;
  max-width: 300px;
  width: 70%;
  height: 30%;
`;
export const TokenAmountWrapper = styled.div<{
  height: string;
  marginTop: string;
}>`
  // width: 100%;
  height: ${({ height }) => height};
  background: rgb(248, 240, 255);
  border: 1.2px solid transparent;
  // box-shadow: inset 0 1px 2px rgba(175, 151, 196, 0.3);
  border-radius: 15px;
  margin-top: ${({ marginTop }) => marginTop};
  &:hover {
    border: 1.2px solid rgb(244, 242, 243);
    box-shadow: inset 1px 1px 5px 1px rgba(175, 151, 196, 0.35);
  } //184, 152, 233
`;

export const TokenAmountContainer = styled.div<{
  marginTop: string;
}>`
  padding-left: 15px;
  padding-right: 20px;
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
  left: 92%;
  top: 1.45%;
  cursor: pointer;
  color: White;
  width: 18px;
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
  position: fixed;
  top: 285px;
  left: 28.5%;
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

export const TokenInput = styled.input<{ loading: boolean }>`
  font-family: "Inter custom", sans-serif;
  width: 100%;
  // background: transparent;
  border: none;
  font-size: 30px;
  color: #adadad;
  outline: none;
  cursor: auto;

  font-size: 35px;
  animation-fill-mode: both;
  background: ${({ loading }) =>
    loading
      ? `linear-gradient(
    to left,
    rgb(167, 160, 173) 25%,
    rgb(240, 240, 240) 50%,
    rgb(167, 160, 173) 75%
  )`
      : "#a7a0ad"};
  will-change: background-position;
  background-size: 400%;
  -webkit-background-clip: text;
  color: transparent;
  caret-color: #adadad;

  ${({ loading }) =>
    loading &&
    css`
      animation: ${loadingAnimation} 1.5s infinite;
    `}
`;

export const TokenSelectButton = styled.div`
  font-family: "Open Sans", sans-serif;
  display: flex;
  align-items: center;
  background-color: ${(props: any) => props.color};
  color: rgb(255, 255, 255);
  cursor: pointer;
  border: ${({ color }: any) =>
    color !== "white" ? "none" : "1px solid rgb(184, 152, 233)"};
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

export const SelectedToken = styled.span<{ color: string }>`
  display: flex;
  margin: 0px 0.25rem;
  font-size: 18px;
  width: max-content;
  color: ${({ color }) => color};
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
  // min-width: 480px;
  width: 460px;
  // height: 100%;
  // color: White;
  background-color: rgba(184, 152, 233, 0.95);
  text-align: right;
  // box-shadow: inset 0 3px 4px rgba(175, 151, 196, 0.4);

  padding: 6px 7px;
  border-top: 1px solid rgb(214, 212, 245);
  border-radius: 20px;
  box-shadow:
    inset 0 -5px 10px -5px rgba(29, 64, 76, 0.4),
    -15px 15px 2px rgba(169, 134, 206, 0.1),
    -10px 10px 2px rgba(169, 134, 206, 0.1),
    -5px 5px 5px rgba(169, 134, 206, 0.1);

  //   margin: 30px auto 0;
  transition: height 3s ease-out;
  position: relative;
  overflow: hidden;
  //   width: fit-content;
`;

export const TransactionsContainer = styled.div`
  height: 100%;
  width: 750px;

  background-color: rgb(184, 152, 233);
  padding: 6px 8px;
  border-top: 1px solid rgb(214, 212, 245);
  border-radius: 20px;
  box-shadow:
    inset 0 -5px 10px -5px rgba(29, 64, 76, 0.4),
    -15px 15px 2px rgba(169, 134, 206, 0.1),
    -10px 10px 2px rgba(169, 134, 206, 0.1),
    -5px 5px 5px rgba(169, 134, 206, 0.1);

  //   margin: 30px auto 0;
  transition: height 3s ease-out;
`;
export const NetworkItem = styled.div<{ selected: boolean }>`
  padding: 0px 16px;
  //   height: 48px;
  width: 100%;
  display: flex;

  &:hover {
    background-color: rgb(255, 255, 255, 0.2);
    cursor: pointer;
  }
  opacity: ${({ selected }) => (selected ? 0.4 : 1)};
`;

export const loadingAnimation = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const LoadingBubble = styled.div`
  border-radius: 12px;
  height: 24px;
  width: 50%;
  animation: ${loadingAnimation} 1.5s infinite;
  animation-fill-mode: both;
  background: linear-gradient(
    to left,
    rgb(15, 25, 55) 25%,
    rgb(7, 13, 31) 50%,
    rgb(15, 25, 55) 75%
  );
  will-change: background-position;
  background-size: 400%;
`;

export const GlowingText = styled.span`
  font-size: 35px;
  animation-fill-mode: both;
  background: ${(props: any) =>
    props.loading
      ? `linear-gradient(
    to left,
    rgb(98, 107, 128) 25%,
    rgb(255, 255, 255) 50%,
    rgb(98, 107, 128) 75%
  )`
      : "white"};
  will-change: background-position;
  background-size: 400%;
  -webkit-background-clip: text;
  color: transparent;

  ${(props: any) =>
    props.loading &&
    css`
      animation: ${loadingAnimation} 1s infinite;
    `}
`;

export const TransactionRowontainer = styled(Flex)`
  width: 100%;
  height: 100px;
  background: rgb(248, 240, 255);
  border: 1.2px solid transparent;
  // box-shadow: inset 0 1px 2px rgba(175, 151, 196, 0.3);
  border-radius: 15px;
  border: 1.2px solid rgb(244, 242, 243);
  box-shadow:
    inset 0 -5px 5px -5px rgba(29, 64, 76, 0.4),
    -15px 15px 2px rgba(169, 134, 206, 0.1),
    -10px 10px 2px rgba(169, 134, 206, 0.1),
    -5px 5px 5px rgba(169, 134, 206, 0.1);
`;
