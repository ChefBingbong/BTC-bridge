import { ChainId, V2_SUBGRAPHS, V3_SUBGRAPHS } from "@pancakeswap/chains";
import { GraphQLClient } from "graphql-request";

export const THE_GRAPH_PROXY_API = "https://thegraph.pancakeswap.com";

export const V2_SUBGRAPH_URLS = {
  ...V2_SUBGRAPHS,
  [ChainId.POLYGON_ZKEVM]: `${THE_GRAPH_PROXY_API}/exchange-v2-polygon-zkevm`,
  [ChainId.BASE]: `${THE_GRAPH_PROXY_API}/exchange-v2-base`,
  [ChainId.ETHEREUM]: `${THE_GRAPH_PROXY_API}/exchange-v2-eth`,
  [ChainId.BSC]: `${THE_GRAPH_PROXY_API}/exchange-v2-bsc`,
  [ChainId.ARBITRUM_ONE]: `${THE_GRAPH_PROXY_API}/exchange-v2-arb`,
  [ChainId.ZKSYNC]: `${THE_GRAPH_PROXY_API}/exchange-v2-zksync`,
  [ChainId.LINEA]: `${THE_GRAPH_PROXY_API}/exchange-v2-linea`,
  [ChainId.OPBNB]: `${THE_GRAPH_PROXY_API}/exchange-v2-opbnb`,
};

export const V3_SUBGRAPH_URLS = {
  ...V3_SUBGRAPHS,
  [ChainId.POLYGON_ZKEVM]: `${THE_GRAPH_PROXY_API}/exchange-v3-polygon-zkevm`,
  [ChainId.BASE]: `${THE_GRAPH_PROXY_API}/exchange-v3-base`,
  [ChainId.ETHEREUM]: `${THE_GRAPH_PROXY_API}/exchange-v3-eth`,
  [ChainId.BSC]: `${THE_GRAPH_PROXY_API}/exchange-v3-bsc`,
  [ChainId.ARBITRUM_ONE]: `${THE_GRAPH_PROXY_API}/exchange-v3-arb`,
  [ChainId.ZKSYNC]: `${THE_GRAPH_PROXY_API}/exchange-v3-zksync`,
  [ChainId.LINEA]: `${THE_GRAPH_PROXY_API}/exchange-v3-linea`,
  [ChainId.OPBNB]: `${THE_GRAPH_PROXY_API}/exchange-v3-opbnb`,
};

export const v3Clients: { [chain: number]: GraphQLClient } = {
  [ChainId.ETHEREUM]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ETHEREUM]),
  [ChainId.GOERLI]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.GOERLI]),
  [ChainId.BSC]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC]),
  [ChainId.BSC_TESTNET]: new GraphQLClient(
    V3_SUBGRAPH_URLS[ChainId.BSC_TESTNET],
  ),
  [ChainId.ARBITRUM_ONE]: new GraphQLClient(
    V3_SUBGRAPH_URLS[ChainId.ARBITRUM_ONE],
  ),
  [ChainId.ARBITRUM_GOERLI]: new GraphQLClient(
    V3_SUBGRAPH_URLS[ChainId.ARBITRUM_GOERLI],
  ),
  [ChainId.POLYGON_ZKEVM]: new GraphQLClient(
    V3_SUBGRAPH_URLS[ChainId.POLYGON_ZKEVM],
  ),
  [ChainId.ZKSYNC]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ZKSYNC]),
  [ChainId.ZKSYNC_TESTNET]: new GraphQLClient(
    V3_SUBGRAPH_URLS[ChainId.ZKSYNC_TESTNET],
  ),
  [ChainId.LINEA]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.LINEA]),
  [ChainId.LINEA_TESTNET]: new GraphQLClient(
    V3_SUBGRAPH_URLS[ChainId.LINEA_TESTNET],
  ),
  [ChainId.BASE]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BASE]),
  [ChainId.BASE_TESTNET]: new GraphQLClient(
    V3_SUBGRAPH_URLS[ChainId.BASE_TESTNET],
  ),
  [ChainId.SCROLL_SEPOLIA]: new GraphQLClient(
    V3_SUBGRAPH_URLS[ChainId.SCROLL_SEPOLIA],
  ),
  [ChainId.OPBNB]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.OPBNB]),
};

export const v2Clients: { [chain: number]: GraphQLClient } = {
  [ChainId.ETHEREUM]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.ETHEREUM]),
  [ChainId.BSC]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.BSC]),
  [ChainId.POLYGON_ZKEVM]: new GraphQLClient(
    V2_SUBGRAPH_URLS[ChainId.POLYGON_ZKEVM],
  ),
  [ChainId.ZKSYNC]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.ZKSYNC]),
  [ChainId.LINEA]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.LINEA]),
  [ChainId.BASE]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.BASE]),
  [ChainId.ARBITRUM_ONE]: new GraphQLClient(
    V2_SUBGRAPH_URLS[ChainId.ARBITRUM_ONE],
  ),
  [ChainId.OPBNB]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.OPBNB]),
};

export const v3SubgraphClient = new GraphQLClient(
  `${THE_GRAPH_PROXY_API}/exchange-v3-eth`,
);
export const v2SubgraphClient = new GraphQLClient(
  `${THE_GRAPH_PROXY_API}/exchange-v2-eth`,
);
