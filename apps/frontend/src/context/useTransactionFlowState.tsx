import {
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

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

  const toggleTransactionFailedModal = useCallback(
    (): void => setTransactionFailed(false),
    [],
  );
  const togglePendingModal = useCallback((): void => {
    setConfirmation(false);
    setPending((w: boolean) => !w);
    setPendingTransaction(true);
  }, []);

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
