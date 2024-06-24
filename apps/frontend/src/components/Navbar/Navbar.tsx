import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import PrimaryButton from "../Button/PrimaryButton/PrimaryButton";
import { shortenAddress } from "~/utils/misc";
import { UilAngleDown } from "@iconscout/react-unicons";

export const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0px;
  z-index: 100;
  /* background: rgb(12, 18, 43); */

  ${(props: any) =>
    props.isNavbarDark &&
    css`
      background: rgb(12, 18, 43);
    `}
`;

export const Nav = styled.nav`
  padding: 24px 16px;
  width: 100%;
  height: 72px;
  z-index: 2;
  box-sizing: border-box;
  display: block;
`;

export const Box = styled.div`
  box-sizing: border-box;
  vertical-align: initial;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
`;

export const BoxItemContainer = styled.div`
  box-sizing: border-box;
  vertical-align: initial;
  -webkit-tap-highlight-color: transparent;
  justify-content: ${(props: any) => props.allignment};
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  width: 100%;
  align-items: center;
`;

const ROUTES: string[] = ["swap"];

const NavLinks = ({ routes }: { routes: string[] }) => {
  return (
    <>
      {routes.map((route: string) => {
        return (
          <Link
            href={`/${route === "home" ? "" : route}`}
            key={route}
            className="mx-1 hidden flex-row items-center gap-2 md:flex"
          >
            <span className=" w-full rounded-xl px-4 py-2 text-center text-[20px] hover:cursor-pointer">
              {route}
            </span>
          </Link>
        );
      })}
    </>
  );
};

export const Navbar = () => {
  const [isNavbarDark, setIsNavbarDark] = useState(false);
  const { address: account, isConnected: active } = useAccount();
  const { connectAsync, connectors } = useConnect();

  const { disconnect } = useDisconnect();

  const changeBackground = () => {
    if (window.scrollY >= 66) {
      setIsNavbarDark(true);
    } else {
      setIsNavbarDark(false);
    }
  };

  const enableConnection = useCallback(async () => {
    if (!connectors[0]) return;
    try {
      const connected = await connectAsync({ connector: connectors[0] });
      return connected;
    } catch (error) {
      console.error(error);
    }
  }, [connectors, connectAsync]);

  const closeConnection = useCallback(() => {
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    changeBackground();
    window.addEventListener("scroll", changeBackground);
  });

  return (
    <Wrapper isNavbarDark={isNavbarDark}>
      <Nav>
        <Box>
          <BoxItemContainer allignment={"flex-start"}>
            <div className="mx-5 flex h-full items-center gap-2 ">
              <Image alt="" src="/gardenLogo.svg" width={120} height={120} />
            </div>

            <NavLinks routes={ROUTES} />
          </BoxItemContainer>

          <BoxItemContainer allignment={"flex-end"}>
            <div className="mr-5 flex  h-full items-center">
              <PrimaryButton
                className="mt-[2px] py-[6px] hover:bg-[rgb(249,135,177)]"
                onClick={async () => {
                  !active ? enableConnection() : closeConnection();
                }}
              >
                <span className="mr-2 hidden bg-transparent xs:block">
                  {active ? shortenAddress(account) : "Connect"}
                </span>

                {active && (
                  <>
                    <span className="mr-2 hidden bg-transparent xs:block">
                      |
                    </span>
                    <Image
                      src="/svgs/metamask-fox.svg"
                      alt="Alert Image"
                      height={16}
                      width={16}
                      unoptimized
                      className="bg-transparent"
                    />
                  </>
                )}
              </PrimaryButton>
            </div>
          </BoxItemContainer>
        </Box>
      </Nav>
    </Wrapper>
  );
};

export default Navbar;
