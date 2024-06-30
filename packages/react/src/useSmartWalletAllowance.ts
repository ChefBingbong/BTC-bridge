import { SmartWalletRouter } from '@btc-swap/router-sdk'
import { Currency } from '@pancakeswap/sdk'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

export const useAllowance = (inputCurrency: Currency | undefined, address: Address | undefined) => {
  return useQuery({
    queryKey: ['allowance-query', address, inputCurrency?.wrapped.address],
    queryFn: async () => {
      if (!inputCurrency || !address) {
        throw new Error('allowance query params are not defined')
      }

      return SmartWalletRouter.getContractAllowance(inputCurrency, address)
    },
    refetchInterval: 20000,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(address && inputCurrency),
  })
}
