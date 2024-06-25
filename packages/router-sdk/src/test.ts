import { BitcoinNetwork, BitcoinWallet, BitcoinProvider, EVMWallet } from '@catalogfi/wallets'
import { Orderbook, Chains, Assets, Actions, parseStatus } from '@gardenfi/orderbook'
import { GardenJS } from '@gardenfi/core'
import { Wallet } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { sha256 } from 'viem'

import * as crypto from 'crypto'

const bitcoinWallet = BitcoinWallet.fromPrivateKey(
  '227572F3AB5202E67607BD16091856201A9F5507C6346F48B43AD9A02345AC06',
  new BitcoinProvider(BitcoinNetwork.Testnet),
  //   { pkType: 'p2wpkh-p2sh' },
)
console.log(bitcoinWallet)

const signer = new Wallet(
  '0xf1031b0f2f727d9694bc3afce4f23ff17c7e57759ad0569fdfef9ddec659c260',
  new JsonRpcProvider('https://rpc.sepolia.org'),
) as any
// create your evm wallet
const evmWallet = new EVMWallet(signer)

console.log(evmWallet)
;(async () => {
  const orderbook = await Orderbook.init({
    url: 'https://stg-test-orderbook.onrender.com/',
    signer,
  })

  const wallets = {
    [Chains.bitcoin_testnet]: bitcoinWallet,
    [Chains.ethereum_sepolia]: evmWallet,
  }

  const garden = new GardenJS(orderbook, wallets)

  const sendAmount = 0.0001 * 1e8
  const recieveAmount = (sendAmount - 0.3 / 100) * sendAmount
  const secret = crypto.randomBytes(32).toString('hex')
  const secretHash = sha256(secret as any)
  // const orderId = await garden.swap(Assets.bitcoin_testnet.BTC, Assets.ethereum_sepolia.WBTC, sendAmount, recieveAmount)
  const orderId = await orderbook.createOrder({
    fromAsset: Assets.bitcoin_testnet.BTC,
    toAsset: Assets.ethereum_sepolia.WBTC,
    sendAddress: 'msXFy8k44jLkugwmr6XVMeVBggHEZeHXwM',
    receiveAddress: await evmWallet.getAddress(),
    sendAmount: sendAmount.toString(),
    receiveAmount: recieveAmount.toString(),
    secretHash,
    btcInputAddress: 'msXFy8k44jLkugwmr6XVMeVBggHEZeHXwM',
  })
  console.log(orderId)

  garden.subscribeOrders(await evmWallet.getAddress(), async (orders) => {
    const order = orders.filter((order) => order.ID === orderId)[0]
    // console.log(orders)

    // console.log(order)

    if (!order) return

    const action = parseStatus(order)

    if (action === Actions.UserCanInitiate || Actions.UserCanRedeem) {
      const swapper = garden.getSwap(order)
      const swapOutput = await swapper.next()
      console.log(swapper, swapOutput)

      console.log(`Completed Action ${swapOutput.action} with transaction hash: ${swapOutput.output}`)
    }
  })
})()
