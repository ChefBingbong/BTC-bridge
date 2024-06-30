import { SmartWalletRouter } from '@btc-swap/router-sdk'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

export const useSmartWalletDetails = (address: Address, _chainId?: number) => {
  const chainOverride = _chainId ?? 1
  return useQuery({
    queryKey: ['smartWalletDetails', address, chainOverride],
    queryFn: async (): Promise<{ address?: Address; nonce?: bigint; wallet: any } | undefined> => {
      if (!address) return undefined
      return SmartWalletRouter.getUserSmartWalletDetails(address, chainOverride)
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(address && chainOverride),
  })
}
