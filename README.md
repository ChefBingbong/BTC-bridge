# Smart Wallet Router SDK

This SDK extends the PancakeSwap Universl and Swap routers for enbling users to execute batched transactions from an abstracted smart contract wallet contract. This enables users to make advanced trades on pancakeswap such as custom gas fee token trades.

### Batched transactions
The Smart Wallet is a smart contract router that the user can manage. the relayer of the wallet factory executes the users contract calls through signature bsed verification. 

### Witness transfers with Permit2
The smart wallet contract also integrates with permit2 to enable users to execute trades from their smart wallet through as if they were calling from their main E0A account. this means that u dont need to deposit tokens into your smart wallet and then trade from there.

Instead you execute the trade from you main EOA account and a transaction gets added into the batch which uses permit2 to do a transferFrom call from you E0A account to your smart wallet instance, before executing the rest of the trade

### Ecexute trades with custom gas token from any chain
This is possible by enbaling and implementing Signature based witness transfers with the witness being the smart wallet relaler private key. Combining all this together,  users can make trades where they dont pay gas in native currency, but rather they pay the gass fee in the equivilent amount of the base token in their trade and this fee gets sent to the smart wallet relayer, who in turns executes the trade on behalf of the user.

The smart wallet SDK also makes it possibles for users to pay transaction fees with currencies on other chains.
