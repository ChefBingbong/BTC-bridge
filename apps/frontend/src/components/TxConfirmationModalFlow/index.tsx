import React from "react";
import { UilTimes, UilArrowLeft } from "@iconscout/react-unicons";
import TxConfirmationModal from "./TransactionConfirmationModal/TransactionConfirmationModal";
import PendingTransactionModal from "./PendinTransactionModal";

import TransactionRejectedModal from "./TransactionRejectedModal";
import TransactionSubmittedModal from "./TransactionSubmittedModal";
import { useTransactionFlow } from "~/context/useTransactionFlowState";
import { Backdrop } from "../CSS/WalletModal.styles";
import { Currency } from "@pancakeswap/swap-sdk-core";

interface ITopRow {
  isLeftDisplay?: boolean;
  isRightDisplay?: boolean;
  backFunction?: () => void;
  close?: () => void;
  title?: string;
}

export const TopRowNavigation = ({
  isLeftDisplay = false,
  isRightDisplay = false,
  backFunction = () => {},
  close = () => {},
  title = "",
}: ITopRow) => {
  return (
    <div
      className={`mb-2 flex items-center ${
        isRightDisplay && !isLeftDisplay ? "justify-end" : "justify-between"
      } px-2`}
    >
      {isLeftDisplay && (
        <div onClick={backFunction}>
          {title === "" ? (
            <UilArrowLeft className={" hover:cursor-pointer"} />
          ) : (
            <span className="text-[17px] font-semibold">{title}</span>
          )}
        </div>
      )}
      {isRightDisplay && (
        <div onClick={close}>
          <UilTimes className={" hover:cursor-pointer"} />
        </div>
      )}
    </div>
  );
};

interface TxFlowProps {
  text: string;
  buttonState: string;
  asset: Currency;
  executeTx: () => Promise<void>;
}

function TransactionFlowModals({
  text,
  buttonState,
  asset,
  executeTx,
}: TxFlowProps) {
  const {
    pending,
    togglePendingModal,
    toggleRejectedModal,
    rejected,
    confirmation,
    toggleConfirmationModal,
    submitted,
    toggleSubmittedModal,
  } = useTransactionFlow();

  return (
    <>
      <Backdrop visible={confirmation || pending || rejected || submitted}>
        {confirmation && (
          <TxConfirmationModal
            confirmation={confirmation}
            toggleConfirmationModal={toggleConfirmationModal}
            text={text}
            asset={asset}
            transactionType={"Transaction"}
            executeTx={executeTx}
            open={confirmation}
          />
        )}
        {pending && (
          <PendingTransactionModal
            close={togglePendingModal}
            open={pending}
            text={text}
            transactionType={"Transaction"}
            asset={asset}
          />
        )}
        {submitted && (
          <TransactionSubmittedModal
            close={toggleSubmittedModal}
            open={submitted}
            asset={asset}
            chain={"destinationChain"}
          />
        )}
        {rejected && (
          <TransactionRejectedModal
            close={toggleRejectedModal}
            open={rejected}
          />
        )}
      </Backdrop>
    </>
  );
}

export default TransactionFlowModals;
