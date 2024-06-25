import { ChainId } from "@pancakeswap/chains";
import { useMemo } from "react";
import { styled } from "styled-components";
// import { space, SpaceProps } from "styled-system";
import useHttpLocations from "~/hooks/useHttpLocations";
import { BinanceIcon } from "@pancakeswap/uikit";

import { getCurrencyLogoUrlsByInfo, type CurrencyInfo } from "./utils";
import TokenLogo from "./TokenLogo";

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`;

export function CurrencyLogo({
  currency,
  size = "24px",
  style,
  useTrustWalletUrl,
  ...props
}: {
  currency?: CurrencyInfo & {
    logoURI?: string | undefined;
  };
  size?: string;
  style?: React.CSSProperties;
  useTrustWalletUrl?: boolean;
}) {
  const uriLocations = useHttpLocations(currency?.logoURI);

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return [];

    if (currency?.isToken) {
      const logoUrls = getCurrencyLogoUrlsByInfo(currency, {
        useTrustWallet: useTrustWalletUrl,
      });

      if (currency?.logoURI) {
        return [...uriLocations, ...logoUrls];
      }
      return [...logoUrls];
    }
    return [];
  }, [currency, uriLocations, useTrustWalletUrl]);

  if (currency?.isNative) {
    if (currency.chainId === ChainId.BSC) {
      return <BinanceIcon width={size} style={style} {...props} />;
    }
    if (currency.chainId === 0) {
      return (
        <StyledLogo
          size={size}
          srcs={["https://tokens.pancakeswap.finance/images/symbol/wbtc.png"]}
          width={size}
          style={style}
          {...props}
        />
      );
    }
    return (
      <StyledLogo
        size={size}
        srcs={[
          `https://assets.pancakeswap.finance/web/native/${currency.chainId}.png`,
        ]}
        width={size}
        style={style}
        {...props}
      />
    );
  }

  return (
    <StyledLogo
      size={size}
      srcs={srcs}
      alt={`${currency?.symbol ?? "token"} logo`}
      style={style}
      {...props}
    />
  );
}
