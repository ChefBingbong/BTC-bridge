import type React from "react";
import Navbar from "~/components/Navbar/Navbar";
import styled from "styled-components";

export const GlowSecondary = styled.div<{ top: number; right: number }>`
  position: absolute;
  top: ${({ top }: { top: number }) => top}%;
  right: ${({ right }: { right: number }) => right}%;

  //   bottom: 0;
  background: rgb(254, 215, 155);
  background: radial-gradient(
    circle,
    rgba(254, 215, 155, 1) 59%,
    rgba(254, 215, 155, 0.9500393907563025) 81%,
    rgba(29, 138, 191, 0) 97%
  );
  filter: blur(100px);
  // z-index: -10;
  width: 600px;
  border-radius: 50%;
  overflow: hidden;
  height: 600px;
`;

export const GlowContainer = styled.div<{ top: number; right: number }>`
  position: absolute;
  top: ${({ top }: { top: number }) => top}%;
  right: ${({ right }: { right: number }) => right}%;

  //   bottom: 0;
  // background: #ffffff5;

  // z-index: -10;
  width: 550px;
  border-radius: 50%;
  overflow: hidden;
  height: 550px;
`;
interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className=" flex h-screen w-full flex-col items-center overflow-hidden bg-[rgb(216,190,254)]  text-white ">
      <Navbar />
      <GlowContainer right={-15} top={-25}>
        <GlowSecondary right={-15} top={-20} />
      </GlowContainer>

      <div id="layout" className=" z-50 w-full w-full flex-1 items-center ">
        <GlowContainer right={80} top={74}>
          <GlowSecondary right={-3} top={15} />
        </GlowContainer>
        {children}
      </div>
    </div>
  );
}

export default DefaultLayout;
