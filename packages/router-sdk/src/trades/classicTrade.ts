import type { ChainId, TradeType } from '@pancakeswap/sdk'
import { SmartRouter, SwapRouter, type SmartRouterTrade } from '@pancakeswap/smart-router'
import { maxUint256, type Address } from 'viem'
import { RouterTradeType, Routers, type Command } from '../encoder/buildOperation'
import { OperationType, type WalletOperationBuilder } from '../encoder/walletOperations'
import { getSwapRouterAddress } from '../utils/getSwapRouterAddress'
import type { SmartWalletTradeOptions } from '../types/smartWallet'

export const RouterRecipientByTrade: { [router in Routers]: (chain: ChainId) => Address } = {
  [Routers.SmartOrderRouter]: (chainId: ChainId) => getSwapRouterAddress(chainId),
}
export class ClasicTrade implements Command {
  readonly tradeType: RouterTradeType

  constructor(
    public trade: SmartRouterTrade<TradeType>,
    public options: SmartWalletTradeOptions,
  ) {
    this.tradeType = this.options.SmartWalletTradeType
    const { underlyingTradeOptions } = options
    if (underlyingTradeOptions?.fee && underlyingTradeOptions?.flatFee) {
      throw new Error('Cannot specify both fee and flatFee')
    }
  }

  encode(planner: WalletOperationBuilder): void {
    const { trade, options } = this
    const { chainId, smartWalletDetails, account } = options

    const tradeOptions = options.underlyingTradeOptions
    const inputToken = trade.inputAmount.currency.wrapped.address
    const routerRecipient = RouterRecipientByTrade[this.options.router](chainId)

    const amountIn = SmartRouter.maximumAmountIn(trade, tradeOptions.slippageTolerance, trade.inputAmount).quotient
    const smartRouterAddress = getSwapRouterAddress(chainId)
    const permit2Address = smartWalletDetails.address

    if (!options.hasApprovedPermit2) {
      planner.addExternalUserOperation(OperationType.APPROVE, [permit2Address, maxUint256], inputToken)
    }
    if (this.tradeType === RouterTradeType.SmartWalletTradeWithPermit2) {
      planner.addUserOperation(
        OperationType.WALLET_TRANSFER_FROM,
        [account, smartWalletDetails.address, amountIn, inputToken],
        smartWalletDetails.address,
      )
      if (routerRecipient === smartRouterAddress) {
        const { calldata, value } = SwapRouter.swapCallParameters(trade, tradeOptions as never)
        planner.addUserOperation(OperationType.APPROVE, [routerRecipient, BigInt(amountIn)], inputToken)
        planner.addUserOperationFromCall([{ address: routerRecipient, calldata, value }])
      }
    }
  }
}
