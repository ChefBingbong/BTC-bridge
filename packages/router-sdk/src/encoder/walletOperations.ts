import type { ChainId } from '@pancakeswap/chains'
import type { AbiParametersToPrimitiveTypes } from 'abitype'
import { type Address, type Hex, encodeAbiParameters, parseAbiItem, getFunctionSelector } from 'viem'
import type { SwapCall, UserOp } from '../types/smartWallet'

export type ABIType = typeof ABI_PARAMETER
export type OperationUsed = keyof typeof ABI_PARAMETER
export type ABIParametersType<TOperationType extends OperationUsed> = AbiParametersToPrimitiveTypes<
  ABIType[TOperationType]['inputs']
>

export enum OperationType {
  EXEC = 'EXEC',
  CREATE_WALLET = 'CREATE_WALLET',
  TRANSFER = 'TRANSFER',
  TRANSFER_FROM = 'TRANSFER_FROM',
  WALLET_TRANSFER_FROM = 'WALLET_TRANSFER_FROM',
  APPROVE = 'APPROVE',

  PERMIT2_PERMIT = 'PERMIT2_PERMIT',
  PERMIT2_PERMIT_BATCH = 'PERMIT2_PERMIT_BATCH',
  PERMIT2_TRANSFER_FROM = 'PERMIT2_TRANSFER_FROM',
  PERMIT2_TRANSFER_FROM_BATCH = 'PERMIT2_TRANSFER_FROM_BATCH',
  PERMIT2_TRANSFER_TO_RELAYER_WITNESS = 'PERMIT2_TRANSFER_TO_RELAYER_WITNESS',
  CLAIM_PERMIT = 'CLAIM_PERMIT',
}

export const ABI_PARAMETER = {
  // samrt wallet ops
  [OperationType.WALLET_TRANSFER_FROM]: parseAbiItem(
    'function transferFrom(address from, address to, uint160 amount, address token)',
  ),
  [OperationType.CREATE_WALLET]: parseAbiItem('function createWallet(address _owner)'),
  [OperationType.EXEC]: parseAbiItem([
    'function exec(ECDSAExec memory _walletExec, bytes calldata _signature)',
    'struct AllowanceOp { AllowanceOpDetails[] details; address spender; uint256 sigDeadline; }',
    'struct AllowanceOpDetails { address token; uint160 amount; uint48 expiration; uint48 nonce; }',
    'struct ECDSAExec { AllowanceOp allowanceOp; UserOp[] userOps; UserOp[] bridgeOps; address wallet; uint256 nonce; uint256 chainID; uint256 bridgeChainID; uint256 sigChainID; }',
    'struct UserOp { address to; uint256 amount; bytes data; }',
  ]),

  // ERC20 ops
  [OperationType.TRANSFER]: parseAbiItem('function transfer(address to, uint256 amount)'),
  [OperationType.TRANSFER_FROM]: parseAbiItem('function transferFrom(address from, address to, uint256 amount)'),
  [OperationType.APPROVE]: parseAbiItem('function approve(address spender, uint256 amount)'),
}

export class WalletOperationBuilder {
  userOps: UserOp[]
  externalUserOps: any[]

  constructor() {
    this.userOps = []
    this.externalUserOps = []
  }

  addUserOperation<TOperationType extends OperationUsed>(
    type: TOperationType,
    parameters: ABIParametersType<TOperationType>,
    contract: Address,
    value = 0n,
  ): void {
    const { encodedSelector, encodedInput } = encodeOperation(type, parameters)
    const operationCalldata = encodedSelector.concat(encodedInput.substring(2)) as Hex
    const userOperation = { to: contract, amount: value, data: operationCalldata }
    this.userOps.push(userOperation)
  }

  addExternalUserOperation<TOperationType extends OperationUsed>(
    type: TOperationType,
    parameters: ABIParametersType<TOperationType>,
    contract: Address | undefined = undefined,
    value = 0n,
  ): void {
    const { encodedSelector, encodedInput } = encodeOperation(type, parameters)
    const operationCalldata = encodedSelector.concat(encodedInput.substring(2)) as Hex
    const userOperation = { to: contract, value, data: operationCalldata }
    this.externalUserOps.push(userOperation)
  }

  addUserOperationFromCall = (calls: SwapCall[]): void => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    calls.forEach((call: SwapCall) => {
      const { address, value, calldata } = call
      const userOperation = { to: address, amount: BigInt(value), data: calldata }
      this.userOps.push(userOperation)
    })
  }
}

export type WalletOperation = {
  encodedInput: Hex
  encodedSelector: Hex
}

export function encodeOperation<TOperationType extends OperationUsed>(
  type: TOperationType,
  parameters: ABIParametersType<TOperationType>,
): WalletOperation {
  const operationAbiItem = ABI_PARAMETER[type]
  const encodedSelector = getFunctionSelector(operationAbiItem)
  const encodedInput = encodeAbiParameters(operationAbiItem.inputs, parameters as never)

  return { encodedSelector, encodedInput }
}
