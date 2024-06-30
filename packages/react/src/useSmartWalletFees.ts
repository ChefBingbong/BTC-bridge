import { SmartWalletRouter } from '@btc-swap/router-sdk'
import type { Currency } from '@pancakeswap/sdk'
import { useQuery } from '@tanstack/react-query'

export const useSmartWalletFees = (
  inputCurrency: Currency,
  feeCurrency: Currency,
  outputCurrency: Currency,
  amount: string,
) => {
  return useQuery({
    queryKey: ['fees-query', inputCurrency?.symbol, outputCurrency?.symbol, feeCurrency?.symbol, amount],
    queryFn: async () => {
      if (!feeCurrency || !inputCurrency || !outputCurrency || amount === '') return undefined

      return SmartWalletRouter.estimateSmartWalletFees({
        feeAsset: feeCurrency?.symbol,
        inputCurrency: inputCurrency,
        outputCurrency: outputCurrency,
      })
    },
    refetchInterval: 10000,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(inputCurrency && outputCurrency && feeCurrency && amount !== ''),
  })
}
