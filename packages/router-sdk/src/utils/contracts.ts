import type { ChainId } from '@pancakeswap/chains'
import { erc20Abi, getContract, type Address } from 'viem'
import { smartWalletAbi as walletAbi } from '../abis/SmartWalletAbi'
import { smartWalletFactoryAbi as factoryAbi } from '../abis/SmartWalletFactoryAbi'
import { Deployments } from '../constants/deploymentUtils'
import { getViemClient } from '../provider/client'

export const getSmartWalletFactory = (chainId: ChainId) => {
  const client = getViemClient({ chainId })
  const address = Deployments[chainId].ECDSAWalletFactory
  return getContract({ address, client, abi: factoryAbi as typeof factoryAbi })
}

export const getSmartWallet = (chainId: ChainId, address: Address) => {
  const client = getViemClient({ chainId })
  return getContract({ address, client, abi: walletAbi })
}

export const getErc20Contract = (chainId: ChainId, address: Address) => {
  const client = getViemClient({ chainId })
  return getContract({ address, client, abi: erc20Abi })
}
