import { RefObject, useCallback, useMemo, useRef, useState } from "react";
import { PopOverScreenContainer } from "../PopOverScreen/PopOverScreen";
import { Box, Flex, Input, Text } from "@pancakeswap/uikit";
import { UilTimes, UilSearch } from "@iconscout/react-unicons";
import useNativeCurrency, { useAllTokens } from "~/hooks/useCurrency";
import { NetworkItem } from "./styles";
import { CurrencyLogo } from "../CurrencyLogo/CurrencyLogo";
import { BoxItemContainer } from "../Navbar/styles";
import { Currency } from "@pancakeswap/sdk";
import { ChainLogo } from "../CurrencyLogo/ChainLogo";
import { chains } from "~/config/wagmiConfig";
import { useSwapctionHandlers } from "~/state/swap/hooks";

export const TokenSearchBar = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
}) => {
  return (
    <BoxItemContainer allignment="center">
      <div
        className={
          "relative mb-3 flex h-[45px] w-full max-w-[95%] items-center justify-center rounded-2xl border border-[rgb(214,182,263)] bg-[rgb(221,198,254,0.3)] px-4  "
        }
      >
        <UilSearch className=" mr-2 h-6 w-6" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-[15px] font-medium tracking-wide  text-[#280D5F99]  outline-none placeholder:text-[#280D5F99]"
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
  onCurrencySelect,
  asset,
}: any) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const native = useNativeCurrency(0 as any);

  const allTokens = useAllTokens();
  const inputRef = useRef<HTMLInputElement>();

  const showProvidersOnClick = useCallback(() => {
    setShowProvidersPopOver((p: boolean) => !p);
  }, [setShowProvidersPopOver]);

  const handleSearch = useCallback(
    (val: Currency) => {
      if (!val) return;
      return (
        searchTerm === "" ||
        val.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        val?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [searchTerm],
  );

  const filteredtTokens = useMemo(() => {
    return [native, ...Object.values(allTokens)].filter((val) => {
      return handleSearch(val);
    });
  }, [allTokens, handleSearch, native]);

  return (
    <PopOverScreenContainer
      showPopover={showProivdersPopOver}
      onClick={showProvidersOnClick}
    >
      <div className="flex w-full items-center justify-between px-6 py-4">
        <Text fontSize="18px" fontWeight="600" color="#280D5F">
          Choose a Currency
        </Text>
        <UilTimes
          className="h-6 w-6 text-white hover:cursor-pointer"
          onClick={showProvidersOnClick}
        />
      </div>
      <div>
        <TokenSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="overflow-y-scroll">
        {filteredtTokens.map((token, index) => {
          const network =
            token.chainId === 0
              ? "Bitcoin Network"
              : chains.find((c) => c.id === token.chainId)?.name;
          return (
            <NetworkItem
              key={`${token.symbol}${token.chainId}${index}`}
              style={{ justifyContent: "space-between" }}
              onClick={() => {
                onCurrencySelect(token);
                showProvidersOnClick();
              }}
              selected={token.symbol === asset?.symbol}
            >
              <div className=" coingrid-scrollbar my-[5px] flex items-center justify-start">
                <div className="relative h-8 w-8">
                  <CurrencyLogo currency={token} size="28px" />

                  {token.chainId !== 0 && (
                    <ChainLogo
                      chainId={token.chainId}
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
                <div className="flex flex-col items-start justify-center">
                  <Text color="#280D5F" pl="12px">
                    {token.symbol}
                  </Text>
                  <div className="flex  items-start justify-center gap-1">
                    {/* <Text pl="12px" fontSize="13px">
                      {token.name}
                    </Text> */}
                    <Text
                      color="#7A6EAA"
                      pl="12px"
                      // color="rgba(255,255,255,0.7)"
                      fontSize="13px"
                    >{`on ${network}`}</Text>
                  </div>
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
