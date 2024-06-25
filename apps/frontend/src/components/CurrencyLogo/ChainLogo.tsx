import Image from "next/image";
import { CSSProperties, memo } from "react";
import { HelpIcon, Box } from "@pancakeswap/uikit";

export const ChainLogo = memo(
  ({
    chainId,
    width = 24,
    height = 24,
    style,
    ...props
  }: {
    chainId?: number;
    width?: number;
    height?: number;
    style?: CSSProperties;
  }) => {
    const icon = chainId ? (
      <Image
        alt={`chain-${chainId}`}
        style={{ maxHeight: `${height}px`, ...style }}
        src={`https://assets.pancakeswap.finance/web/chains/${chainId}.png`}
        width={width}
        height={height}
        unoptimized
      />
    ) : (
      <HelpIcon width={width} height={height} />
    );
    return <Box {...props}>{icon}</Box>;
  },
);
