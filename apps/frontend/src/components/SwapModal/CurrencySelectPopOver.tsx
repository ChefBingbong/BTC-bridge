import { RefObject, useCallback, useRef, useState } from "react";
import { PopOverScreenContainer } from "../PopOverScreen/PopOverScreen";
import { Box, Flex, Input, Text } from "@pancakeswap/uikit";
import { UilTimes, UilSearch } from "@iconscout/react-unicons";
import { useAllTokens } from "~/hooks/useCurrency";
import { NetworkItem } from "./styles";
import { CurrencyLogo } from "../CurrencyLogo/CurrencyLogo";
import { BoxItemContainer } from "../Navbar/styles";

const TokenSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <BoxItemContainer allignment="center">
      <div
        className={
          "relative mb-3 flex h-[45px] w-full max-w-[95%] items-center justify-center rounded-2xl border border-[rgb(214,182,263)] bg-[rgba(255,255,255,0.1)] px-4 text-white "
        }
      >
        <UilSearch className=" mr-2 h-6 w-6" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-[15px] font-medium  tracking-wide text-white outline-none placeholder:text-white"
          placeholder={"Search transactions by token"}
          onBlur={() => null}
        />
      </div>
    </BoxItemContainer>
  );
};
export const CurrencySelectPopOver = ({
  setShowProvidersPopOver,
  showProivdersPopOver,
}: any) => {
  const allTokens = useAllTokens();
  const inputRef = useRef<HTMLInputElement>();

  const showProvidersOnClick = useCallback(() => {
    setShowProvidersPopOver((p: boolean) => !p);
  }, [setShowProvidersPopOver]);

  return (
    <PopOverScreenContainer
      showPopover={showProivdersPopOver}
      onClick={showProvidersOnClick}
    >
      <div className="flex w-full items-center justify-between px-6 py-4">
        <Text fontSize="18px" fontWeight="600">
          Choose a Currency
        </Text>
        <UilTimes
          className="h-6 w-6 text-white hover:cursor-pointer"
          onClick={showProvidersOnClick}
        />
      </div>
      <div>
        <TokenSearchBar />
      </div>
      <div className="overflow-y-scroll">
        {Object.values(allTokens).map((token) => {
          return (
            <NetworkItem
              key={token.chainId}
              style={{ justifyContent: "space-between" }}
              // onClick={() => {
              //   setActiveChain(allNetworks ? undefined : chain.id)
              //   onClick()
              // }}
              selected={false}
            >
              <div className=" coingrid-scrollbar my-[5px] flex items-center justify-start">
                <CurrencyLogo currency={token} size="28px" />

                <div className="flex flex-col items-start justify-center">
                  <Text pl="12px">{token.symbol}</Text>
                  <Text pl="12px" fontSize="13px">
                    {token.name}
                  </Text>
                </div>
              </div>

              {/* {isActive && (
                    <Box paddingRight="18px">
                      <Dot style={{ height: '12px', width: '12px' }} show color="success" className="dot" />
                    </Box>
                  )} */}
            </NetworkItem>
          );
        })}
      </div>
    </PopOverScreenContainer>
  );
};
