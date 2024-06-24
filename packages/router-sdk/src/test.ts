// import { BitcoinNetwork, BitcoinWallet, BitcoinProvider, EVMWallet } from '@catalogfi/wallets'
// import { Orderbook, Chains, Assets, Actions, parseStatus } from '@gardenfi/orderbook'
// import { GardenJS } from '@gardenfi/core'
// import { Wallet } from 'ethers'
// import { JsonRpcProvider } from '@ethersproject/providers'
// import { Address, sha256 } from 'viem'
// import * as crypto from 'crypto'
// // create your bitcoin wallet

import { privateKeyToAccount } from 'viem/accounts'

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

// // console.log(await bitcoinWallet.getAddress())
// ;(async () => {
//   console.log(await bitcoinWallet.getAddress())

//   const orderbook = await Orderbook.init({
//     signer,
//   })

//   const wallets = {
//     [Chains.bitcoin_testnet]: bitcoinWallet,
//     [Chains.ethereum_sepolia]: evmWallet,
//   }

//   const garden = new GardenJS(orderbook, wallets)

//   //make sure the initialise the orderbook and your wallet

//   const sendAmount = 0.001 * 1e8
//   const receiveAmount = sendAmount - 0.03 * sendAmount //taking 0.3% as fee
//   //   const sendAddress = '<YOUR BITCOIN ADDRESS>'
//   const secret = crypto.randomBytes(32).toString('hex') as Address
//   const secretHash = sha256(secret)

//   //   const orderId = await garden.swap(Assets.bitcoin_testnet.BTC, Assets.ethereum_sepolia.WBTC, sendAmount, recieveAmount)
//   const orderId = await orderbook.createOrder({
//     fromAsset: Assets.bitcoin_testnet.BTC,
//     toAsset: Assets.ethereum_sepolia.WBTC,
//     sendAddress: await bitcoinWallet.getAddress(),
//     receiveAddress: await signer.getAddress(),
//     sendAmount: sendAmount.toString(),
//     receiveAmount: receiveAmount.toString(),
//     secretHash,
//     btcInputAddress: await bitcoinWallet.getAddress(),
//   })

//   garden.subscribeOrders(await evmWallet.getAddress(), async (orders) => {
//     const order = orders.filter((order) => order.ID === orderId)[0]
//     if (!order) return

//     const action = parseStatus(order)

//     if (action === Actions.UserCanInitiate || Actions.UserCanRedeem) {
//       const swapper = garden.getSwap(order)
//       const swapOutput = await swapper.next()
//       console.log(`Completed Action ${swapOutput.action} with transaction hash: ${swapOutput.output}`)
//     }
//   })
// })()
// // import bitcoin from 'bitcoinjs-lib'

// // // import wif from 'wif'

// // function generateP2PKHAddress(wifKey: string) {
// //   // Decode the WIF key
// //   const keyPair = bitcoin.ECPair.fromWIF(wifKey, bitcoin.networks.testnet);

// //   // Get the public key in a compressed format
// //   const { address } = bitcoin.payments.p2pkh({
// //     pubkey: keyPair.publicKey,
// //     network: bitcoin.networks.testnet,
// //   });

// //   return address;
// // }

// // const wifKey = 'cVLofasJxpmeRtgK7Bgj9tMt5ySEAqffo8swV5VEQvGKnGxD7qT9';
// // const testnetP2PKHAddress = generateP2PKHAddress(wifKey);
// // console.log('Testnet P2PKH Address:', testnetP2PKHAddress);
export const userSigner = privateKeyToAccount('0x3c8353d7be43b7cc41aad0387bb462fce3de5f7d2282c820bf14e515de3f0a80')
console.log(userSigner)
