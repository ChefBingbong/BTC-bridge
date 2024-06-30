import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  UilTimes,
  UilCheckCircle,
  UilExclamationTriangle,
} from "@iconscout/react-unicons";

const opneRight = keyframes` 
    0% {
        right: -150%;
    }
    100% {
        right: 0%;
    }
`;
const openLeft = keyframes` 
    0% {
        right: 0%;
    }
    100% {
        right: -150%;
    }
`;

export const NotificationContainerStyled = styled.div`
  position: fixed;
  z-index: 10000000000;
  right: 0;
  top: 75px;
`;

export const BarStyled = styled.div`
  background-color: ${(props: any) => props.colour};
  bottom: 0;
  height: 5px;
  left: 0;
  position: absolute;
  width: 280px;
`;

export const NotificationStyled = styled.div`
  animation-fill-mode: forwards;
  background-color: white;
  border-radius: 15px;
  border: 1px solid rgb(231, 227, 235);
  box-shadow: 0px 4px 10px rgba(48, 71, 105, 0.1);
  display: flex;
  margin: 15px;
  padding: 15px;
  position: relative;
  overflow: hidden;
  z-index: 9999;

  animation: ${(props: any) => (!props.isClosing ? opneRight : openLeft)} 0.65s;
`;

export const CloseIcon = styled(UilTimes)`
  color: White;
  z-index: 10;
  &:hover {
    cursor: pointer;
  }
`;

const Notification = ({
  dispatch,
  id,
  message = "",
  title = "",
  type = "",
  position = "",
  success,
}: any) => {
  const [isClosing, setIsClosing] = useState(false);
  const [barWidth, setBarWidth] = useState(0);

  const notificationWidth = 320;

  const startTimer = React.useCallback(() => {
    if (isClosing) return;
    const idInt = setInterval(() => {
      setBarWidth((prev) => {
        if (prev < notificationWidth) return prev + 1;

        clearInterval(idInt);
        return prev;
      });
    }, 65);
  }, [isClosing]);

  const closeNotification = React.useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      // @ts-ignore
      dispatch({
        type: "remove_notification",
        id,
      });
    }, 400);
  }, [dispatch, id]);

  useEffect(() => {
    if (isClosing) return;
    if (barWidth === notificationWidth) closeNotification();
  }, [barWidth, isClosing, closeNotification]);

  useEffect(() => startTimer(), [startTimer]);

  return (
    <NotificationStyled
      id={id}
      isClosing={isClosing}
      type={type}
      position={position}
    >
      <div className="mt-1 flex justify-center">
        {type === "info" ? (
          <UilCheckCircle size="40" color={"rgb(38,162,91)"} />
        ) : (
          <UilExclamationTriangle size="40" color={"red"} />
        )}
      </div>
      <div className="ml-4 flex max-w-[250px] flex-col gap-[2px] break-words text-white">
        <div className="flex items-center justify-between">
          <span className="text-[17px] font-[800]  text-[#280d5f]">
            {title}
          </span>
          <UilTimes
            className="h-6 w-6 font-semibold text-[#280d5f] hover:cursor-pointer"
            onClick={closeNotification}
          />
        </div>
        <span className="text-[15px] font-[600] leading-tight text-[#7a6eaa]">
          {message}
        </span>
      </div>
      <BarStyled
        style={{ width: barWidth }}
        colour={success ? "rgb(168,85,247)" : "red"}
      />
    </NotificationStyled>
  );
};

export default Notification;
