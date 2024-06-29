import type { AllowanceOp, UserOp } from '../types/smartWallet'
import type { TypedSmartWalletData } from '../types/eip712'
import type { Address } from 'viem'

export const typedMetaTx = (
  userOps: UserOp[],
  allowanceOp: AllowanceOp,
  nonce: bigint,
  sigChainId: bigint,
  chainId: bigint,
  verifyingContract: Address,
): TypedSmartWalletData => {
  const domain = {
    name: 'ECDSAWallet',
    version: '0.0.1',
    chainId: Number(sigChainId),
    verifyingContract,
  }

  const types = {
    AllowanceOp: [
      { name: 'details', type: 'AllowanceOpDetails[]' },
      { name: 'spender', type: 'address' },
      { name: 'sigDeadline', type: 'uint256' },
    ],
    AllowanceOpDetails: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint160' },
      { name: 'expiration', type: 'uint48' },
      { name: 'nonce', type: 'uint48' },
    ],
    UserOp: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    ECDSAExec: [
      { name: 'allowanceOp', type: 'AllowanceOp' },
      { name: 'userOps', type: 'UserOp[]' },
      { name: 'nonce', type: 'uint256' },
      { name: 'chainID', type: 'uint256' },
      { name: 'sigChainID', type: 'uint256' },
    ],
  }
  const values = {
    allowanceOp: allowanceOp,
    userOps: userOps,
    nonce,
    chainID: chainId,
    sigChainID: sigChainId,
  }

  return { domain, types, values }
}
