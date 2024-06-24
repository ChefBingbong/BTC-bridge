import type { ChainId } from '@pancakeswap/chains'
import type { BigintIsh, Currency } from '@pancakeswap/swap-sdk-core'
import type { PancakeSwapOptions } from '@pancakeswap/universal-router-sdk'
import type { MethodParameters } from '@pancakeswap/v3-sdk'
import type { Address, GetContractReturnType, Hex } from 'viem'
import type { smartWalletAbi as walletAbi } from '../abis/SmartWalletAbi'
import type { RouterTradeType, Routers } from '../encoder/buildOperation'
import type { SmartWalletPermitOptions } from './permit2'

export interface BaseTradeOptions<TOps> {
  account: Address
  chainId: ChainId
  router: Routers
  underlyingTradeOptions: TOps
}

export interface ClassicTradeOptions<TOps> extends BaseTradeOptions<TOps> {
  router: Routers
}

export interface SmartWalletTradeOptions extends BaseTradeOptions<PancakeSwapOptions> {
  hasApprovedPermit2: boolean
  hasApprovedRelayer: boolean
  assets: { inputAsset: Address; feeAsset: Address; outputAsset: Address }
  allowance: WalletAllownceDetails
  isUsingPermit2: boolean
  walletPermitOptions?: SmartWalletPermitOptions
  smartWalletDetails: { address: Address; nonce: bigint }
  SmartWalletTradeType: RouterTradeType
  router: Routers
}

export type UserOp = {
  readonly to: Address
  readonly amount: bigint
  readonly chainId: ChainId | number
  readonly data: Hex
}

export interface AllowanceOp {
  readonly details: {
    readonly token: Address
    readonly amount: BigintIsh
    readonly expiration: BigintIsh
    readonly nonce: BigintIsh
  }[]
  readonly spender: Address
  readonly sigDeadline: BigintIsh
}

export type SwapCall = MethodParameters & { address: Address }

export type ExecuteTradeCallback = {
  tradeType: RouterTradeType
  signature: Hex
  walletOperations: UserOp[]
  account: Address
  chainId: ChainId
}

export type FeeResponse = {
  gasEstimate: bigint
  gasCostInQuoteToken: number
  gasCostInBaseToken: number
  gasCostInUSD: number
}

export type PackedAllowance = [bigint, Address, number]
export type TokenAllowance = { allowance: bigint; needsApproval: boolean }
export type WalletAllownceDetails = {
  t0Allowance: TokenAllowance
  t1Allowance: TokenAllowance
  t0nonce: number
  t1nonce: number
}
export type SmartWalletGasParams = {
  feeAsset: string
  inputCurrency: Currency
  outputCurrency: Currency
}
export type SmartWalletDetails = { address: Address; nonce: bigint; wallet: GetContractReturnType<typeof walletAbi> }
