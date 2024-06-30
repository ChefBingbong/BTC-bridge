import styled, { css } from "styled-components"

export const Backdrop = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0%;
  left: 0%;
  opacity: 0;
  pointer-events: none;
  backdrop-filter: blur(1px);
  z-index: 100000000000;
  pointer-events: none;
  transition: opacity 0.15s ease-in-out !important;
  background: rgb(69, 32, 144, 0.45);
  ${(props: any) =>
    props.visible &&
    css`
      opacity: 1;
      pointer-events: all;
    `}
`;

export const FormWrapper = styled.div`
  position: fixed;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  width: 430px;
  background-color: rgb(13, 17, 28);
  text-align: right;
  padding: 30px 15px;
  padding-bottom: 20px;
  border-radius: 15px;
  display: block;
  z-index: 10000000000;
  border-radius: 24px;
  max-width: 436px;
  width: 100%;
  z-index: 1;
  border: 1px solid rgb(231, 227, 235);
  background: white;
  color: #280d5f;
  /* font-weight: 900; */
  /* padding: 20px; */
  position: relative;
`;

export const FormWrapper2 = styled.div`
  position: fixed;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  width: 430px;
  background-color: rgb(13, 17, 28);
  text-align: right;
  /* padding-bottom: 10px; */
  border-radius: 15px;
  display: block;
  z-index: 10000000000;
  border-radius: 24px;
  max-width: 436px;
  width: 100%;
  z-index: 1;
  border: 1px solid rgb(231, 227, 235);
  background: white;
  color: #280d5f;
  /* font-weight: 900; */
  /* padding: 20px; */
  position: relative;
`;
