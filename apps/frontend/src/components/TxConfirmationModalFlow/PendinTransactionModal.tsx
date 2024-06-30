import React from "react";
import { FormWrapper } from "../CSS/WalletModal.styles";
import { UilSpinner, UilArrowLeft, UilTimes } from "@iconscout/react-unicons";

interface PendingTransactionModalProps {
  close: () => void;
  open: boolean;
  text: string;
  transactionType: string;
  asset: any;
}

const PendingModalInner = ({
  close,
  text,
  transactionType,
  chain,
  asset,
}: {
  close: () => void;
  text: string;
  transactionType: string;
  chain: any;
  asset: any;
}) => {
  return (
    <>
      <div className={`mb-2 flex items-center ${"justify-between"} px-2`}>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div onClick={close}>
          <UilArrowLeft className={"hover:cursor-pointer"} />
        </div>
        <div onClick={close}>
          <UilTimes className={" text-[1fc7d4] hover:cursor-pointer"} />
        </div>
      </div>
      <div className="my-4 flex flex-col items-center justify-center  px-2">
        <UilSpinner className={"h-32 w-32 animate-spin text-blue-500"} />
      </div>
      <div className="my-2 flex flex-col items-center gap-[6px]">
        <span className=" text-[18px] font-semibold">
          Waiting For Confirmation
        </span>
        <span className="text-center text-[17px]">{`${transactionType.concat(
          "ing",
        )} ${text} ${asset.symbol} on Garden`}</span>
        <span className="text-center text-[14px] text-gray-500">
          Confirm this transaction in your wallet
        </span>
      </div>
    </>
  );
};

function PendingTransactionModal({
  close,
  text,
  transactionType,
  asset,
}: PendingTransactionModalProps) {
  return (
    <FormWrapper>
      <PendingModalInner
        close={close}
        text={text}
        transactionType={transactionType}
        chain={"chain"}
        asset={asset}
      />
    </FormWrapper>
  );
}

export default PendingTransactionModal;
