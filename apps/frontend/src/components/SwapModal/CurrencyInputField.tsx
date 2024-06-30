import { UilCopy } from "@iconscout/react-unicons";
import { type Currency } from "@pancakeswap/sdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "react-feather";
import { useTokenBalance } from "~/hooks/useBalance";
import { ChainLogo } from "../CurrencyLogo/ChainLogo";
import { CurrencyLogo } from "../CurrencyLogo/CurrencyLogo";
import { CurrencySelectPopOver } from "./CurrencySelectPopOver";
import {
  ButtonContents,
  InfoWrapper,
  SelectedToken,
  TokenAmountContainer,
  TokenAmountWrapper,
  TokenInput,
  TokenSelectButton,
} from "./styles";
import { BoxItemContainer } from "../Navbar/styles";
import { Flex } from "@pancakeswap/uikit";
import styled from "styled-components";

export const SummaryBar = styled(Flex)<{ hide: boolean; elHeight: number }>`
  overflow-y: hidden;
  transition: height 0.2s ease-in-out;
  height: ${({ hide, elHeight }) => (!hide ? "0px" : "45px")};
  width: 100%;
  margin-top: 4px;
  margin-bottom: 8px;
`;
export const CurrencyInputField = ({
  currency,
  onCurrencySelect,
  onTypeInput,
  inputValue,
  currencyLoading,
  disabled = false,
}: {
  currency: Currency;
  onCurrencySelect: any;
  onTypeInput: any;
  inputValue: string;
  currencyLoading: boolean;
  disabled: boolean;
}) => {
  const [isActive, setActive] = useState(false);
  const [showProivdersPopOver, setShowProvidersPopOver] =
    useState<boolean>(false);
  const [elementHeight, setElementHeight] = useState<number>(48);

  const containerRef = useRef(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { balance: assetBalance } = useTokenBalance(currency?.wrapped);

  const show = useMemo(
    () => currency && currency.symbol === "WBTC",
    [currency],
  );
  const handleUserInput = useCallback(
    (val: string) => {
      onTypeInput(val);
    },
    [onTypeInput],
  );

  const handleOnBlur = useCallback(() => {
    setTimeout(() => {
      setActive(false);
    }, 100);
  }, []);

  useEffect(() => {
    const elRef = contentRef.current;
    if (elRef) setElementHeight(elRef.scrollHeight);
  }, []);

  return (
    <TokenAmountWrapper
      // height="100%"
      marginTop={"5px"}

      // style={{
      //   background: isActive ? "rgb(233, 227, 21)" : undefined,
      // }}
    >
      <CurrencySelectPopOver
        setShowProvidersPopOver={setShowProvidersPopOver}
        showProivdersPopOver={showProivdersPopOver}
        asset={currency}
        onCurrencySelect={onCurrencySelect}
      />
      <TokenAmountContainer marginTop={"0px"}>
        <div className="h-full flex-col items-center justify-center gap-4">
          <InfoWrapper>
            <TokenInput
              loading={currencyLoading}
              disabled={disabled}
              placeholder={"0.0"}
              onChange={(e) => {
                handleUserInput(e.target.value);
              }}
              onFocus={() => setActive(true)}
              onBlur={handleOnBlur}
              value={inputValue}
              required
              type="number"
            />

            {!currency?.isNative && (
              <UilCopy
                className="ml-2 h-8 w-8 text-gray-400 hover:cursor-pointer"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    currency?.address as string,
                  );
                }}
              />
            )}
            <TokenSelectButton
              color={currency ? "white" : "rgb(249,155,197)"}
              onClick={() => setShowProvidersPopOver(true)}
            >
              <ButtonContents>
                <div className="jutsify-center flex flex items-center gap-1 break-words">
                  {currency && (
                    <div className="relative h-6 w-6">
                      <CurrencyLogo currency={currency} size="24px" />

                      {currency?.chainId !== 0 && (
                        <ChainLogo
                          chainId={currency.chainId}
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

                  <SelectedToken color={currency ? "grey" : "white"}>
                    {currency ? currency.symbol : "From asset"}
                  </SelectedToken>
                </div>

                <ChevronDown size={"25px"} color="grey" />
              </ButtonContents>
            </TokenSelectButton>
          </InfoWrapper>

          <div className="flex w-full justify-between gap-2  text-gray-500">
            <div className="flex items-center gap-2">
              <div className="overflow-ellipsis text-sm">{"You spend"}</div>
              {currencyLoading && (
                <div className="flex h-[16px] w-[16px] rounded-full bg-gray-300">
                  <div
                    className="h-[16px] w-[16px] animate-spin-slow-fast-slow items-center justify-center rounded-full border-[3px] border-white border-b-[rgb(219,104,147)]"
                    style={{
                      boxShadow:
                        "inset 0 0 5px rgba(109, 72, 195, 0.95), 0 2.5px 3.5px  rgba(119, 82, 205, 0.25)",
                    }}
                  />
                </div>
              )}
            </div>

            {currency && (
              <div className="overflow-ellipsis text-sm">{`${assetBalance} ${currency?.symbol}`}</div>
            )}
          </div>
        </div>

        <SummaryBar
          ref={contentRef}
          hide={show}
          elHeight={elementHeight}
          // alignItems="center"
        >
          <BoxItemContainer allignment="center">
            <div
              className={
                "relative flex  h-[45px] w-full items-center justify-center rounded-lg border bg-[rgb(0,0,0,0.04)] px-4 hover:bg-[rgb(0,0,0,0.02)]  "
              }
              style={{
                // background: isActive ? "rgb(240,227,254)" : undefined,
                border: "border: 1.2px solid rgb(244, 242, 243)",
                // boxShadow: "inset 1px 0px 1px 1px rgba(175, 151, 196, 0.35)",
              }}
            >
              <input
                value={""}
                onChange={(e) => null}
                className="font-500 flex-1 bg-transparent text-[14px] font-medium tracking-wide text-[#7A6EAA] outline-none placeholder:text-[#7A6EAA]"
                placeholder={"Paste your BTC address"}
                onMouseEnter={() => setActive(true)}
                onMouseLeave={handleOnBlur}
              />
            </div>
          </BoxItemContainer>
        </SummaryBar>
      </TokenAmountContainer>
    </TokenAmountWrapper>
  );
};
