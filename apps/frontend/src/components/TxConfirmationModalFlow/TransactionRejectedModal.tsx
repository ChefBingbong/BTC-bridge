import React from "react";
import { FormWrapper } from "../CSS/WalletModal.styles";
import { UilExclamationTriangle, UilTimes } from "@iconscout/react-unicons";
import PrimaryButton from "../Button/PrimaryButton/PrimaryButton";

interface PendingTransactionModalProps {
  close: () => void;
}

const TransactionRejectedInner = ({ close }: { close: () => void }) => {
  return (
    <>
      <div className={`mb-2 flex items-center ${"justify-between"} px-2`}>
        <span className="font-800 text-[17px] text-[#280d5f]">Error</span>
        <div onClick={close}>
          <UilTimes className={" text-[1fc7d4] hover:cursor-pointer"} />
        </div>
      </div>
      <div className="my-4 flex flex-col items-center justify-center  px-2">
        <UilExclamationTriangle className={"h-24 w-24 text-red-500"} />
      </div>
      <div className="my-2 flex flex-col items-center gap-[6px]">
        <span className=" text-[18px] font-semibold text-[#280d5f]">
          Transaction Failed
        </span>
        <span className="text-center text-[15px] text-gray-500">
          Oops your transaction failed unexpectedly
        </span>
      </div>
      <div className="mb-2 mt-8 flex items-center justify-center">
        <PrimaryButton
          className="bg-[rgb(154,200,255)]! w-full items-center justify-center rounded-[15px] py-4 font-semibold hover:bg-[rgb(164,210,255)]"
          onClick={close}
        >
          Close
        </PrimaryButton>
      </div>
    </>
  );
};

function TransactionRejectedModal({ close }: PendingTransactionModalProps) {
  return (
    <FormWrapper>
      <TransactionRejectedInner close={close} />
    </FormWrapper>
  );
}

export default TransactionRejectedModal;
