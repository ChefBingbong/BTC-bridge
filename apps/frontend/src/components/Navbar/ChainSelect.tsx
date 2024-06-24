import { UilAngleDown } from "@iconscout/react-unicons";
import Image from "next/image";
import type { Chain } from "viem";
import { useAccount } from "wagmi";

const ChainSelect = () => {
  const { chain: currentChain } = useAccount();

  if (!currentChain) return null;
  return <ChainSelectorButton activeChain={currentChain} />;
};

const ChainSelectorButton = ({
  activeChain,
}: {
  activeChain: Chain | undefined;
}) => {
  return (
    <div className="w-auto rounded-3xl bg-[rgb(154,200,255)]  px-4 py-[6px] text-center">
      <div className="flex min-w-full items-center justify-center gap-2">
        {activeChain?.id && (
          <Image
            alt={`chain-${activeChain?.id}`}
            src={`https://assets.pancakeswap.finance/web/chains/${activeChain?.id}.png`}
            width={24}
            height={24}
            unoptimized
          />
        )}
        <div className="  hidden text-center font-semibold lg:block">
          {activeChain ? `${activeChain.name}` : "Unknown Network"}
        </div>
        <UilAngleDown className={"h-6 w-6"} />
      </div>
    </div>
  );
};

export default ChainSelect;
