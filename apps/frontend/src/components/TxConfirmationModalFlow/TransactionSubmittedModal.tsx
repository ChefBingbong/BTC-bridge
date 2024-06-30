import React from "react";
import { FormWrapper } from "../CSS/WalletModal.styles";
import { UilCheckCircle, UilTimes } from "@iconscout/react-unicons";

interface TxSubmittedProps {
  close: () => void;
  open: boolean;
  asset: any;
  chain: any;
}

const TxSubmittedInner = ({ close }: { close: () => void }) => {
  return (
    <>
      <div className={`mb-2 flex items-center ${"justify-between"} px-2`}>
        <span className="font-800 text-[17px] text-[#280d5f]">Success</span>
        <div onClick={close}>
          <UilTimes className={" text-[1fc7d4] hover:cursor-pointer"} />
        </div>
      </div>
      <div className="my-4 flex flex-col items-center justify-center  px-2">
        <UilCheckCircle className={"h-24 w-24 text-[#1fc7d4]"} />
      </div>
      {/* <div
        className="mx-auto my-0 mt-4 flex w-fit items-center justify-center gap-3 rounded-full bg-tertiary px-4 py-2 text-gray-400 hover:cursor-pointer hover:bg-lightTertiary"
        onClick={addAsset}
      >
        <span>Add Token to Metamask</span>
        <Icon />
      </div> */}
      <div className="my-2 flex flex-col items-center gap-[6px]">
        <span className=" text-[18px] font-semibold text-[#280d5f]">
          Transaction Submitted
        </span>
        <span className="text-center text-[15px] text-gray-500">
          Please wait while your transaction settles.
        </span>
      </div>
    </>
  );
};

function TransactionSubmittedModal({
  close,
  open,
  asset,
  chain,
}: TxSubmittedProps) {
  // const AddAsset = useCallback(async(): Promise<void> => {
  //   const tokenAddress = chainAdresses[chain.fullName]!.assets[asset.Icon]?.tokenAddress
  //   const symbol = `testRen${asset.Icon}`
  //   //@ts-ignore
  //   const { ethereum } = window;
  //   try {
  //     await ethereum.request({
  //     method: "wallet_watchAsset",
  //     params: {
  //       type: "ERC20",
  //       options: {
  //         address: tokenAddress,
  //         symbol: symbol,
  //         decimals: asset.decimals,
  //       },
  //     },
  //   });
  //   } catch(error: any) {
  //     console.log(error)
  //   }
  // }, [asset, chain])

  return (
    <FormWrapper>
      <TxSubmittedInner close={close} />
    </FormWrapper>
  );
}

export default TransactionSubmittedModal;
