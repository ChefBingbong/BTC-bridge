import * as chains from "viem/chains";

export const CHAINS = Object.values(chains) as unknown as [
  chains.Chain,
  ...chains.Chain[],
];
