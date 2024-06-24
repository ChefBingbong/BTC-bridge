export const smartWalletFactoryAbi = [
     {
          inputs: [
               {
                    internalType: "contract SmartWalletFactory",
                    name: "_factory",
                    type: "address",
               },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
     },
     {
          inputs: [
               {
                    internalType: "address",
                    name: "_owner",
                    type: "address",
               },
          ],
          name: "createWallet",
          outputs: [
               {
                    internalType: "contract IWallet",
                    name: "",
                    type: "address",
               },
          ],
          stateMutability: "payable",
          type: "function",
     },
     {
          inputs: [],
          name: "factory",
          outputs: [
               {
                    internalType: "contract SmartWalletFactory",
                    name: "",
                    type: "address",
               },
          ],
          stateMutability: "view",
          type: "function",
     },
     {
          inputs: [],
          name: "wallet",
          outputs: [
               {
                    internalType: "contract ECDSAWallet",
                    name: "",
                    type: "address",
               },
          ],
          stateMutability: "view",
          type: "function",
     },
     {
          inputs: [
               {
                    internalType: "address",
                    name: "_owner",
                    type: "address",
               },
               {
                    internalType: "uint256",
                    name: "_nonce",
                    type: "uint256",
               },
          ],
          name: "walletAddress",
          outputs: [
               {
                    internalType: "address",
                    name: "",
                    type: "address",
               },
          ],
          stateMutability: "view",
          type: "function",
     },
] as const;
