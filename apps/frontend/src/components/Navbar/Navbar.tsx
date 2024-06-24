import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import styled from "styled-components";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "~/utils/misc";
import PrimaryButton from "../Button/PrimaryButton/PrimaryButton";
import { Box, BoxItemContainer, Nav, Wrapper } from "./styles";

const ROUTES: string[] = ["swap"];

export const Navbar = () => {
  const { address: account, isConnected: active } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();

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

  return (
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
                  <span className="mr-2 hidden bg-transparent xs:block">|</span>
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
  );
};

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

export default Navbar;
