import { Flex } from "@pancakeswap/uikit";
import styled from "styled-components";

export const FilterdNetworkWrapper = styled(Flex)<{ showPopOver: boolean }>`
  position: absolute;
  width: 100%;
  background: rgb(248, 240, 255);
  margin: 0px -13px;
  //   padding: 12px 12px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  height: max-content;
  z-index: 9999;
  transition: bottom 0.4s ease-in-out;
  bottom: ${({ showPopOver }) => (!showPopOver ? "-100%" : "0%")};
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  border-top: 1.2px solid rgb(244, 242, 243);
  box-shadow: inset 0px 1px 5px 2px rgba(175, 151, 196, 0.45);
  height: 90%;
`;
export const NetworkFilterOverlay = styled(Flex)<{ showPopOver: boolean }>`
  position: absolute;
  width: 100%;
  z-index: 9999;
  bottom: 0%;
  margin: 0px -13px;
  border-radius: 18px;
  background-color: rgb(153, 200, 255);
  height: 100%;
  transition: opacity 0.2s ease-in-out;
  opacity: ${({ showPopOver }) => (!showPopOver ? "0" : "0.8")};
  pointer-events: ${({ showPopOver }) => (showPopOver ? "auto" : "none")};
`;
