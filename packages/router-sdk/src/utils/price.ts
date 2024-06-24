import axios from 'axios'

export const CoingeckoIdMap: { [token: string]: string } = {
  CAKE: 'pancakeswap-token',
  BUSD: 'binance-peg-busd',
  WBNB: 'binancecoin',
  WETH: 'binancecoin',
}
export const fetchMultipleTokenUSDPrice = async (
  tokens: string[],
  ids: string[],
): Promise<{ [token: string]: { usd: string } }> => {
  const idstr = ids.join(',')
  const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${idstr}&vs_currencies=usd`)
  const priceData = response.data as { [token: string]: { usd: string } }
  const tokenPriceMap = {} as { [token: string]: { usd: string } }

  tokens.forEach((token: string, i: number) => {
    tokenPriceMap[token] = priceData[ids[i]]
  })
  return tokenPriceMap
}
