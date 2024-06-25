import { BigNumber } from "bignumber.js";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useBlock } from "~/hooks/useBlock";
import useMachineTimeMs from "~/hooks/useMachineTime";

const DEFAULT_MS_BEFORE_WARNING = 60000;
const NETWORK_HEALTH_CHECK_MS = 10000;

export const NetworkConnectivityWarning = () => {
  const { address: account } = useAccount();

  const [isMounting, setIsMounting] = useState<boolean>(false);
  const machineTime = useMachineTimeMs(NETWORK_HEALTH_CHECK_MS);

  const { blockNumber } = useBlock();

  const waitMsBeforeWarning =
    DEFAULT_MS_BEFORE_WARNING ?? DEFAULT_MS_BEFORE_WARNING;

  const warning = Boolean(
    !!blockNumber &&
      machineTime - new BigNumber(blockNumber).multipliedBy(1000).toNumber() >
        waitMsBeforeWarning,
  );

  useEffect(() => {
    if (!blockNumber) {
      return;
    }
    setIsMounting(true);
    const mountingTimer = setTimeout(() => setIsMounting(false), 1000);

    // this will clear Timeout when component unmount like in willComponentUnmount
    return () => {
      clearTimeout(mountingTimer);
    };
  }, [blockNumber]);

  return (
    <div className="mx-6 flex items-center justify-center gap-2">
      {account && (
        <div className={"flex h-3 w-3  rounded-full bg-green-500"}>
          {!isMounting && (
            <div
              className={`border-primary h-[12px] w-[12px]   animate-spin  items-center justify-center rounded-full border-2 border-b-green-400`}
            />
          )}
        </div>
      )}
      <div
        className={`text-center text-[15px] font-semibold hover:cursor-pointer ${!warning ? "text-yellow-300" : "text-green-500"}`}
      >
        {blockNumber}
      </div>
    </div>
  );
};
