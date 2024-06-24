import { UilAngleDown } from "@iconscout/react-unicons";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import type { Chain } from "viem";
import { useAccount, useChainId, useChains, useClient } from "wagmi";

export const FormWrapper = styled.div`
  position: fixed;
  //   left: 41.5%;
  //   top: 43%;
  transform: translate(-13%, 2%);
  width: 230px;
  background-color: rgb(13, 17, 28);
  text-align: right;
  padding: 10px;
  padding-bottom: 20px;
  border: 1.5px solid rgb(60, 65, 80);
  border-radius: 15px;
  display: block;
  z-index: 10000000000;
  box-shadow: 14px 19px 5px 0px rgba(0, 0, 0, 0.85);
`;

const ChainSelect = () => {
  const { chain: currentChain } = useAccount();
  const ref = useRef<HTMLDivElement>(null);

  console.log(currentChain);
  if (!currentChain) return null;
  return (
    <div className=" relative left-0 h-fit w-fit" ref={ref}>
      <ChainSelectorButton activeChain={currentChain} />
    </div>
  );
};

const ChainSelectorButton = ({
  activeChain,
}: {
  activeChain: Chain | undefined;
}) => {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div className="flex items-center justify-center rounded-3xl bg-[rgb(154,200,255)] px-4 py-[4px] text-center ">
      {activeChain?.id && (
        <Image
          alt={`chain-${activeChain?.id}`}
          src={`https://assets.pancakeswap.finance/web/chains/${activeChain?.id}.png`}
          width={24}
          height={24}
          unoptimized
        />
      )}
      <span className=" block w-full text-center font-semibold">
        {activeChain ? `${activeChain.name}` : "Unknown Network"}
      </span>
      <UilAngleDown className={"h-4 w-4 mlg:h-8 mlg:w-8"} />
    </div>
  );
};

export default ChainSelect;
