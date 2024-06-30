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
    const { smartWalletDetails, account, inAllowance, outAllowance, feeAsset } = options

    const slippageTolerance = options.slippageTolerance
    const chainId = trade.inputAmount.currency.chainId
    const inputToken = trade.inputAmount.currency.wrapped.address
    const routerRecipient = RouterRecipientByTrade[Routers.SmartOrderRouter](chainId)

    const amountIn = SmartRouter.maximumAmountIn(trade, slippageTolerance, trade.inputAmount).quotient
    const smartRouterAddress = getSwapRouterAddress(chainId)
    const permit2Address = smartWalletDetails.address

    const isSameFeeAsset = feeAsset.wrapped.address === inputToken
    const hasApprovedPermit2ForBase = Boolean(inAllowance.allowance >= amountIn)
    const hasApprovedPermit2ForFee = Boolean(outAllowance.allowance >= amountIn)

    if (!hasApprovedPermit2ForBase) {
      planner.addExternalUserOperation(OperationType.APPROVE, [permit2Address, maxUint256], inputToken)
    }
    if (!hasApprovedPermit2ForFee && !isSameFeeAsset) {
      planner.addExternalUserOperation(OperationType.APPROVE, [permit2Address, maxUint256], feeAsset.wrapped.address)
    }
    if (this.tradeType === RouterTradeType.SmartWalletTradeWithPermit2) {
      planner.addUserOperation(
        OperationType.WALLET_TRANSFER_FROM,
        [account, smartWalletDetails.address, amountIn, inputToken],
        smartWalletDetails.address,
      )
      if (routerRecipient === smartRouterAddress) {
        const { calldata, value } = SwapRouter.swapCallParameters(trade, { slippageTolerance })
        planner.addUserOperation(OperationType.APPROVE, [routerRecipient, BigInt(amountIn)], inputToken)
        planner.addUserOperationFromCall([{ address: routerRecipient, calldata, value }])
      }
    }
  }
}
