import {
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { Field } from "~/state/swap/actions";
import { useSwapctionHandlers } from "~/state/swap/hooks";

interface TransactionFlowStateProps {
  children: React.ReactNode;
}

type TransactionFlowContextType = {
  transactionFailed: boolean;
  pending: boolean;
  confirmation: boolean;
  rejected: boolean;
  submitted: boolean;
  toggleTransactionFailedModal: () => void;
  togglePendingModal: () => void;
  toggleRejectedModal: () => void;
  toggleConfirmationModal: () => void;
  toggleSubmittedModal: () => void;
  pendingTransaction: boolean;
  setPendingTransaction: React.Dispatch<SetStateAction<boolean>>;
};

const TransactionFlowContext = createContext({} as TransactionFlowContextType);

function TransactionFlowStateProvider({ children }: TransactionFlowStateProps) {
  const [transactionFailed, setTransactionFailed] = useState<boolean>(false);
  const [rejected, setRejected] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [pendingTransaction, setPendingTransaction] = useState<boolean>(false);

  const { onUserInput } = useSwapctionHandlers();

  const toggleTransactionFailedModal = useCallback((): void => {
    setPending(false);
    setPendingTransaction(false);
    setTransactionFailed(false);
  }, []);
  const togglePendingModal = useCallback((): void => {
    onUserInput(Field.INPUT, "");
    onUserInput(Field.FEE, "");
    onUserInput(Field.OUTPUT, "");

    setConfirmation(false);
    setPending((w: boolean) => !w);
    setPendingTransaction(true);
  }, [onUserInput]);

  const toggleRejectedModal = useCallback((): void => {
    setPending(false);
    setRejected((w: boolean) => !w);
    setPendingTransaction(false);
  }, []);

  const toggleConfirmationModal = useCallback((): void => {
    setConfirmation((w: boolean) => !w);
  }, []);

  const toggleSubmittedModal = useCallback(() => {
    setPending(false);
    setSubmitted((w: boolean) => !w);
  }, []);

  return (
    <TransactionFlowContext.Provider
      value={{
        transactionFailed,
        pending,
        confirmation,
        rejected,
        submitted,
        toggleTransactionFailedModal,
        togglePendingModal,
        toggleRejectedModal,
        toggleConfirmationModal,
        toggleSubmittedModal,
        pendingTransaction,
        setPendingTransaction,
      }}
    >
      {children}
    </TransactionFlowContext.Provider>
  );
}

const useTransactionFlow = () => {
  return useContext(TransactionFlowContext);
};

export { TransactionFlowStateProvider, useTransactionFlow };
