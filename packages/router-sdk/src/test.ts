// import { BitcoinNetwork, BitcoinWallet, BitcoinProvider, EVMWallet } from '@catalogfi/wallets'
// import { Orderbook, Chains, Assets, Actions, parseStatus } from '@gardenfi/orderbook'
// import { GardenJS } from '@gardenfi/core'
// import { JsonRpcProvider, Wallet } from 'ethers'
// // import { sha256 } from 'viem'

// // import * as crypto from 'crypto'

// const bitcoinWallet = BitcoinWallet.fromPrivateKey(
//   'E78CE801E717FEAF671342272BF84FACBDEADF6F778915BC268F008D4F6F0B90',
//   new BitcoinProvider(BitcoinNetwork.Testnet),
//   //   { pkType: 'p2wpkh-p2sh' },
// )
// console.log(bitcoinWallet)

// const signer = new Wallet(
//   '0xf1031b0f2f727d9694bc3afce4f23ff17c7e57759ad0569fdfef9ddec659c260',
//   new JsonRpcProvider('https://rpc.sepolia.org'),
// ) as any
// // create your evm wallet
// const evmWallet = new EVMWallet(signer)

// console.log(evmWallet)
// ;(async () => {
//   const orderbook = await Orderbook.init({
//     url: 'https://stg-test-orderbook.onrender.com/',
//     signer,
//   })

//   const wallets = {
//     [Chains.bitcoin_testnet]: bitcoinWallet,
//     [Chains.ethereum_sepolia]: evmWallet,
//   }

//   const garden = new GardenJS(orderbook, wallets)

//   const sendAmount = 0.001 * 1e8
//   const recieveAmount = (1 - 0.3 / 100) * sendAmount
//   // const secret = crypto.randomBytes(32).toString('hex')
//   // const secretHash = sha256(secret as any)
//   const orderId = await garden.swap(Assets.ethereum_sepolia.WBTC, Assets.bitcoin_testnet.BTC, sendAmount, recieveAmount)
//   // const orderId = await orderbook.createOrder({
//   //   fromAsset: Assets.ethereum_sepolia.WBTC,
//   //   toAsset: Assets.bitcoin_testnet.BTC,
//   //   receiveAddress: 'tb1qzjk3562fpxjnyfl7lxz5v0qcl48gatdwjd4w6y',
//   //   sendAddress: await evmWallet.getAddress(),
//   //   sendAmount: sendAmount.toString(),
//   //   receiveAmount: recieveAmount.toString(),
//   //   secretHash,
//   //   btcInputAddress: 'tb1qzjk3562fpxjnyfl7lxz5v0qcl48gatdwjd4w6y',
//   // })
//   console.log(orderId)

//   garden.subscribeOrders(await evmWallet.getAddress(), async (orders) => {
//     const order = orders.filter((order) => order.ID === orderId)[0]
//     // console.log(orders)

//     // console.log(order)

//     if (!order) return

//     const action = parseStatus(order)

//     if (action === Actions.UserCanInitiate || Actions.UserCanRedeem) {
//       const swapper = garden.getSwap(order)
//       const swapOutput = await swapper.next()
//       // console.log(swapper, swapOutput)

//       console.log(`Completed Action ${swapOutput.action} with transaction hash: ${swapOutput.output}`)
//     }
//   })
// })()
console.log('0x123'.slice(0, 2))
