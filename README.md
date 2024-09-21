# BTC-EVM bridge
coming soon....

## This is a work in progress

This project is an super quick and advacned native Bitcoin to EVM bride that ultilizes Account abstraction by building the bitcoin bridge on top of my previous Smart router SDK. This letrs users batch all of the transactions together that are nessecary to complete a native BTC brodge aswell as a swap from the bridged BTC on the destination chain to any other asset on that cahin. So in short this project is a native BTC cross chain dex

### Ecexute Native BTC Cross-Chain Swaps with custom gas tokens.
Si ce this BTC bridge is built on top of the Smart router SDK it is, by enbaling and implementing Signature based witness transfers so users can make trades where they dont pay gas in native currency, but rather they pay the gass fee in the equivilent amount of the base token in their trade and this fee gets sent to the smart wallet relayer, who in turns executes the trade on behalf of the user.

### Bridging Native BTC With HTLC's (Hashed Time Lock Contracts) with GardenJS
To bridge native Bitcon this project uses GardenJS. a typescript SDK speciricaly trailored for BTC bridges. Garden is unlike traditional 'bridges' and doesn't have a custodian network or multi-sig securing the bridge. It is built using a decentralized Order Matching Engine and peer-to-peer Atomic Swaps. As a result, Garden's security and decentralization are deferred to the chains on which it is deployed, making it less vulnerable to attacks.


.... more docs coming soon
