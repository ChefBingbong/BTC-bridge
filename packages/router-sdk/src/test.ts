import { BitcoinNetwork, BitcoinWallet, BitcoinProvider, EVMWallet } from '@catalogfi/wallets'
import { Orderbook, Chains, Assets, Actions, parseStatus } from '@gardenfi/orderbook'
import { GardenJS } from '@gardenfi/core'
import { Wallet } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
// create your bitcoin wallet

const bitcoinWallet = BitcoinWallet.fromPrivateKey(
  'E78CE801E717FEAF671342272BF84FACBDEADF6F778915BC268F008D4F6F0B90',
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
    signer,
  })

  const wallets = {
    [Chains.bitcoin_testnet]: bitcoinWallet,
    [Chains.ethereum_sepolia]: evmWallet,
  }

  const garden = new GardenJS(orderbook, wallets)

  const sendAmount = 0.0001 * 1e8
  const recieveAmount = (sendAmount - 0.3 / 100) * sendAmount

  const orderId = await garden.swap(Assets.bitcoin_testnet.BTC, Assets.ethereum_sepolia.WBTC, sendAmount, recieveAmount)

  garden.subscribeOrders(await evmWallet.getAddress(), async (orders) => {
    const order = orders.filter((order) => order.ID === orderId)[0]
    if (!order) return

    const action = parseStatus(order)

    if (action === Actions.UserCanInitiate || Actions.UserCanRedeem) {
      const swapper = garden.getSwap(order)
      const swapOutput = await swapper.next()
      console.log(`Completed Action ${swapOutput.action} with transaction hash: ${swapOutput.output}`)
    }
  })
})()
