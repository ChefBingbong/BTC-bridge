import { UilCopy } from "@iconscout/react-unicons";
import { type Currency } from "@pancakeswap/sdk";
import { useCallback, useState } from "react";
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

export const CurrencyInputField = ({
  currency,
  onCurrencySelect,
  onTypeInput,
  inputValue,
}: {
  currency: Currency;
  onCurrencySelect: any;
  onTypeInput: any;
  inputValue: string;
}) => {
  const [showProivdersPopOver, setShowProvidersPopOver] =
    useState<boolean>(false);

  const { balance: assetBalance } = useTokenBalance(currency?.wrapped);

  const handleUserInput = useCallback(
    (val: string) => {
      onTypeInput(val);
    },
    [onTypeInput],
  );
  return (
    <TokenAmountWrapper height="100px" marginTop={"12px"}>
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
              placeholder={"0.0"}
              onChange={(e) => {
                handleUserInput(e.target.value);
              }}
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
              color={currency ? "white" : "rgb(154,200,255)"}
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
            <div className="overflow-ellipsis text-sm">{"You spend"}</div>

            {currency && (
              <div className="overflow-ellipsis text-sm">{`${assetBalance} ${currency?.symbol}`}</div>
            )}
          </div>
        </div>
      </TokenAmountContainer>
    </TokenAmountWrapper>
  );
};
