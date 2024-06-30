import { Currency } from "@pancakeswap/swap-sdk-core";

export const MESSAGES = (
  transactionType: string,
  success: boolean,
  amount: string,
  asset: Currency,
): string => {
  const messageMapping: { [title: string]: string } = {
    ["Swap"]: `${
      success ? "Successfully swapped" : "Failed to swap"
    } ${amount} ${asset.symbol}`,
  };

  return messageMapping[transactionType] as string;
};
