import {
  type IPosition,
  type notifyType,
  useNotification,
} from "~/context/useNotificationState";

export type TransactionNotiType = {
  type: notifyType;
  title: string;
  message: string;
  position: IPosition;
  success: boolean;
};

export const TransactionNotiTypes: { [type: string]: TransactionNotiType } = {
  Success: {
    type: "info",
    title: "Transaction Success",
    message: "Sucessfully approved recipient address",
    position: "topR",
    success: true,
  },
  Error: {
    type: "error",
    title: "Transaction Failed",
    message: "Unable to approve recipient address",
    position: "topR",
    success: false,
  },
};

const useTransactionNotification = () => {
  const dispatch = useNotification();

  const handleNewNotification = (notiType: "Success" | "Error") => {
    dispatch(TransactionNotiTypes[notiType]);
  };

  return { handleNewNotification };
};

export default useTransactionNotification;
