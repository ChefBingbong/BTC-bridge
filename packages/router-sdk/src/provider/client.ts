import { ChainId } from '@pancakeswap/chains'
import { createPublicClient, fallback, http, type Chain, type PublicClient } from 'viem'
import { CHAINS, PUBLIC_NODES } from './chains'
import { JsonRpcProvider } from '@ethersproject/providers'

const createClients = <TClient extends PublicClient>(chains: Chain[]): Record<ChainId, TClient> => {
  return chains.reduce(
    (prev: Record<ChainId, TClient>, cur: Chain) => {
      const clientConfig = {
        chain: cur,
        transport: fallback(
          (PUBLIC_NODES[cur.id as ChainId] as string[]).map((url) =>
            http(url, {
              timeout: 15_000,
            }),
          ),
          {
            rank: false,
          },
        ),
        batch: {
          multicall: {
            batchSize: cur.id === ChainId.POLYGON_ZKEVM ? 128 : 154 * 200,
            wait: 16,
          },
        },
      }
      const client = createPublicClient(clientConfig)
      console.log(client, clientConfig)
      return {
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        ...prev,
        [cur.id]: client,
      }
    },
    {} as Record<ChainId, TClient>,
  )
}

export const publicClients: Record<ChainId, PublicClient> = createClients<PublicClient>(CHAINS)

export const getViemClient = ({ chainId }: { chainId: ChainId }): PublicClient => {
  return publicClients[chainId]
}

export const getEthersProvider = (chainId: ChainId) => {
  return new JsonRpcProvider(PUBLIC_NODES[chainId][0])
}
