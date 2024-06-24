import type { PermitTransferFrom, Witness } from '@pancakeswap/permit2-sdk'
import { MaxAllowanceTransferAmount, PERMIT_EXPIRATION } from '@pancakeswap/permit2-sdk'
import type { Address } from 'viem'
import type { AllowanceOp } from '../types/smartWallet'
import _isEqual from 'lodash/isEqual'

export const PERMIT_SIG_EXPIRATION = 1800000 // 30 min

export interface PermitWithWithWitness {
  permit: PermitTransferFrom
  witness: Witness
}

export const toDeadline = (expiration: number): number => {
  return Math.floor((Date.now() + expiration) / 1000)
}

export const generatePermitTransferFromTypedData = (
  token: Address,
  amount: bigint,
  spender: Address,
  _witness: Address,
  nonce: bigint,
): PermitWithWithWitness => {
  const permit: PermitTransferFrom = {
    permitted: {
      token: token as string,
      amount,
    },
    spender,
    nonce: nonce,
    deadline: toDeadline(PERMIT_SIG_EXPIRATION).toString(),
  }

  const witness: Witness = {
    witnessTypeName: 'Witness',
    witnessType: { Witness: [{ name: 'user', type: 'address' }] },
    witness: { user: _witness },
  }

  return { permit, witness }
}

export const permit2TpedData = (
  tokens: Address[],
  spender: Address,
  nonces: [bigint, bigint],
): { permitData: AllowanceOp } => {
  if (!tokens) throw new Error('PERMIT: missing token')
  if (!spender) throw new Error('PERMIT: missing spender')

  const sameTokens = _isEqual(tokens[0], tokens[1])
  const allowanceOps = {
    details: tokens.map((token, i) => ({
      token: token,
      amount: MaxAllowanceTransferAmount,
      expiration: BigInt(toDeadline(PERMIT_EXPIRATION).toString()),
      nonce: i > 0 ? (sameTokens ? nonces[1] + 1n : nonces[1]) : nonces[0],
    })),
    spender,
    sigDeadline: BigInt(toDeadline(PERMIT_SIG_EXPIRATION)),
  } as AllowanceOp

  return { permitData: allowanceOps }
}
