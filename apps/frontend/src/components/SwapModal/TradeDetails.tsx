import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { UilQuestionMark}
import {
  ArrowDropDownIcon,
  ArrowDropUpIcon,
  Box,
  Flex,
  Text,
  RefreshIcon,
  //   IconButton,
} from "@pancakeswap/uikit";
import { css, styled } from "styled-components";
import { ChevronDown } from "react-feather";
import { Price, TradeType } from "@pancakeswap/swap-sdk-core";
import { SmartRouterTrade } from "@pancakeswap/smart-router";
import { formatPrice } from "~/utils/misc";
import Toggle from "../Toggle/Toggle";
import { Gas } from "../Icons/GasPump/GasPump";
import { publicClient } from "~/config/viem";
import { useChainId } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";

const RotatingArrow = styled(ChevronDown)<{ open?: boolean }>`
  transform: ${({ open }) => (open ? "rotate(180deg)" : "none")};
  transition: transform 0.1s linear;
`;
export const StyledNotificationWrapper = styled.div<{ show: boolean }>`
  display: flex;
  position: relative;
  overflow: hidden;
  padding: 8px 18px;
  margin-bottom: 6px;
  // background-color: rgba(0, 0, 0, 0.03);
  // padding: 6px 0px
  width: 100%;
  // border-radius: 16px;

  transition:
    background-color 0.6s ease,
    padding 0.3s ease-in-out;
`;

export const Description = styled.div<{ show: boolean; elementHeight: number }>`
  overflow: hidden;
  width: 100%;
  //   padding-top: 7px;
  word-break: break-word;
  transition: max-height 0.33s ease-in-out;
  max-height: ${({ show, elementHeight }) =>
    show ? `${elementHeight}px` : "0px"};
`;
export const StyledFeesContainer = styled(Box)<{
  disabled: boolean;
  show: boolean;
}>`
  padding-left: 4px;
  padding-right: 4px;
  // padding-top: 3px;

  border-radius: 8px;
  z-index: 10;
  //   background: rgba(0, 0, 0, 0.07);
  position: relative;
  //   border: 1.5px dashed ${({ theme }) =>
    theme.isDark ? `${theme.colors.input}` : `${theme.colors.inputSecondary}`};
  &:hover {
    cursor: pointer;
  }

  background-color: ${({ show }) =>
    show ? "rgba(255, 255, 255, 0.11)" : "transparent"};
  margin: 6px 0px;
  width: 100%;
  border-radius: 12px;
  transition: background-color 0.6s ease;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.6;
    `}
`;

export const StyledFeesContainer3 = styled(Flex)`
  padding: 2px 0px;
  border-radius: 16px;
  z-index: 10;
  // background: ${({ theme }) => theme.colors.backgroundAlt};
  background: ${({ theme }) => theme.colors.input};

  border: ${({ theme }) => `1.5px dashed ${theme.colors.inputSecondary}`};
  &:hover {
    cursor: pointer;
  }
`;

export const SummaryBar = styled(Flex)<{ hide: boolean }>`
  overflow-y: hidden;
  transition: height 0.2s ease-in-out;
  height: ${({ hide }) => (!hide ? "0px" : "35px")};
`;

export const TradeDetails = ({
  trade,
  outputAmounts,
  inputAmounts,
  feeAmounts,
}: {
  trade: SmartRouterTrade<TradeType> | null | undefined;
  inputAmounts: {
    inputLoading: boolean;
    inputValue: string;
  };
  outputAmounts: {
    outputLoading: boolean;
    outputValue: string;
  };
  feeAmounts: {
    feesLoading: boolean;
    fees: any;
    outputValueMinusFees: string | undefined;
  };
}) => {
  const chainId = useChainId();
  const [elementHeight, setElementHeight] = useState<number>(20);
  const [show, setShow] = useState<boolean>(false);
  const [inverted, setInverted] = useState<boolean>(false);
  const containerRef = useRef(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = () => {
    setIsChecked((prev) => !prev);
  };
  const handleExpandClick = useCallback(() => setShow(!show), [show]);

  const { data, isPending } = useQuery({
    queryKey: ["network-fees", trade?.gasEstimate.toString()],
    queryFn: async () => {
      try {
        const client = publicClient({ chainId });
        const gasPrice = await client.getGasPrice();
        const gasCost = trade?.gasEstimate;

        if (!gasCost || !gasPrice) return undefined;

        return new BigNumber(gasPrice.toString())
          .multipliedBy(new BigNumber(gasCost.toString()))
          .shiftedBy(-9);
      } catch (error) {
        console.error("gas calc failed ", error);
        return undefined;
      }
    },
    enabled: Boolean(feeAmounts && trade),
  });

  const prices = useMemo(() => {
    if (!trade) return undefined;

    const price = new Price(
      trade.inputAmount.currency,
      trade.outputAmount.currency,
      trade.inputAmount.quotient,
      trade.outputAmount.quotient,
    );
    const rate = formatPrice(price, 4);
    const rateInverted = formatPrice(price.invert(), 4);
    const inputToken = trade.inputAmount.currency.symbol;
    const outputToken = trade.outputAmount.currency.symbol;

    if (inverted)
      return { baseToken: inputToken, quoteToken: outputToken, rate };
    return {
      baseToken: outputToken,
      quoteToken: inputToken,
      rate: rateInverted,
    };
  }, [trade, inverted]);

  useEffect(() => {
    const elRef = contentRef.current;
    if (elRef) setElementHeight(elRef.scrollHeight);
    if (!prices || outputAmounts.outputLoading || !outputAmounts.outputValue) {
      setElementHeight(0);
      setShow(false);
    }
  }, [prices, outputAmounts]);

  return (
    <StyledFeesContainer
      width="100%"
      onClick={handleExpandClick}
      disabled={false}
      show={show}
    >
      <SummaryBar
        justifyContent="space-between"
        alignItems="center"
        hide={true}
        style={{
          borderRadius: "10px",
          // border: "1.5px dashed rgb(118,147,254, 0.5)",
          margin: "0px 6px",
          padding: "0px 12px",
        }}
      >
        <Flex alignItems="center" justifyContent="center">
          <Text fontSize="14px" fontWeight="500" color="#7A6EAA">
            {`1 ${prices?.baseToken} = ${prices?.rate} ${prices?.quoteToken}`}
          </Text>
          {/* <IconButton variant="text" onClick={() => setInverted(!inverted)}>
            <RefreshIcon />
          </IconButton> */}
          <RefreshIcon
            paddingX="4px"
            color="rgb(241, 240, 242)"
            scale="lg"
            width="25px"
            height="25px"
            onClick={() => setInverted(!inverted)}
          />
          {/* <SkeletonText loading={Boolean(inputError)} initialWidth={40} fontSize="14px">
                  {t('%fees%', {
                    fees: formatLocaleNumber({
                      number: Number((selectedQuote?.providerFee + selectedQuote?.networkFee).toFixed(2)),
                      locale,
                      options: { currency: selectedQuote.fiatCurrency, style: 'currency' },
                    }),
                  })}
                </SkeletonText> */}
        </Flex>

        <Flex alignItems="center" justifyContent="center" px="2px">
          <RotatingArrow open={show} />
        </Flex>
      </SummaryBar>
      <StyledNotificationWrapper ref={containerRef} show={show}>
        <Description ref={contentRef} show={show} elementHeight={elementHeight}>
          <Flex width="100%" justifyContent="space-between" py="2px">
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
                <Toggle checked={isChecked} onChange={handleChange} />
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
          <Flex width="100%" justifyContent="space-between" py="2px">
            <Flex justifyContent="space-between" width="100%">
              <Box width="max-content">
                <Text
                  width="max-content"
                  fontSize="13px"
                  color="rgb(235, 235, 235)"
                  fontWeight="600"
                >
                  {"Network cost"}
                </Text>
              </Box>

              <Flex
                width="max-content"
                justifyContent="center"
                alignItems="center"
              >
                <Gas width="15px" height="15px" color="rgb(110, 88, 163)" />
                <Text
                  pl="2px"
                  fontSize="13px"
                  fontWeight="500"
                  color="rgb(325, 235, 235)"
                >
                  {`${data}`}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex width="100%" justifyContent="space-between" py="2px">
            <Flex justifyContent="space-between" width="100%">
              <Box width="max-content">
                <Text
                  width="max-content"
                  fontSize="13px"
                  color="rgb(235, 235, 235)"
                  fontWeight="600"
                >
                  {"Fee cost:"}
                </Text>
              </Box>

              <Box width="max-content">
                <Text
                  fontSize="13px"
                  fontWeight="500"
                  color="rgb(325, 235, 235)"
                >
                  {`${feeAmounts.fees?.gasCostInBaseToken.toExact(3)} ${prices?.baseToken} = ${feeAmounts.fees?.gasCostInQuoteToken.toExact(3)} ${prices?.quoteToken}`}
                </Text>
              </Box>
            </Flex>
          </Flex>
          <Flex width="100%" justifyContent="space-between" py="2px">
            <Flex justifyContent="space-between" width="100%">
              <Box width="max-content">
                <Text
                  width="max-content"
                  fontSize="13px"
                  color="rgb(235, 235, 235)"
                  fontWeight="600"
                >
                  {"Subtotal:"}
                </Text>
              </Box>

              <Box width="max-content">
                <Text
                  fontSize="13px"
                  fontWeight="500"
                  color="rgb(235, 235, 235)"
                >
                  {`(${outputAmounts.outputValue} - ${feeAmounts.fees?.gasCostInQuoteToken.toExact(2)}) ${prices?.quoteToken}  = ${feeAmounts?.outputValueMinusFees} ${prices?.baseToken}`}
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Description>
      </StyledNotificationWrapper>
    </StyledFeesContainer>
  );
};
