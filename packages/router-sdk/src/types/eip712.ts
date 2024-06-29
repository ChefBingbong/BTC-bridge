import type { Address } from 'viem'
import type { AllowanceOp, UserOp } from './smartWallet'

export type DomainType = {
  name: string
  version: string
  chainId: number
  verifyingContract: Address
}

export type Types = {
  name: string
  type: string
}

export type ECDSAExecType = {
  allowanceOp: AllowanceOp
  userOps: UserOp[]
  nonce: bigint
  chainID: bigint
  sigChainID: bigint
}

export type EIP712TypedData = {
  domain: DomainType
  types: { AllowanceOp: Types[]; AllowanceOpDetails: Types[]; UserOp: Types[]; ECDSAExec: Types[] }
  values: ECDSAExecType
}

export type TypedSmartWalletData = {
  domain: DomainType
  types: { AllowanceOp: Types[]; AllowanceOpDetails: Types[]; UserOp: Types[]; ECDSAExec: Types[] }
  values: ECDSAExecType
}
