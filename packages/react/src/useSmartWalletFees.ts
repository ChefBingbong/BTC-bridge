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
      if (!feeCurrency || !inputCurrency || !outputCurrency || amount === '') {
        throw new Error('fee query params are not defined')
      }

      return SmartWalletRouter.estimateSmartWalletFees({
        feeAsset: feeCurrency?.symbol,
        inputCurrency: inputCurrency,
        outputCurrency: outputCurrency,
      })
    },
    refetchInterval: 10000,
    retry: 1500,
    staleTime: 1500,
    refetchOnWindowFocus: false,
    enabled: Boolean(inputCurrency && outputCurrency && feeCurrency && amount !== ''),
  })
}
