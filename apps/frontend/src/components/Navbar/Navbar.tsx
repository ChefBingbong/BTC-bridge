import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "~/utils/misc";
import PrimaryButton from "../Button/PrimaryButton/PrimaryButton";
import { Box, BoxItemContainer, Nav, Wrapper } from "./styles";
import ChainSelect from "./ChainSelect";
import { UilSearch } from "@iconscout/react-unicons";
import { useTransactionFlow } from "~/context/useTransactionFlowState";
import SpinningLoader from "../LoadingSpinner/LoadingSpinner";

const InputDrowdownSkeleton = ({ searchTerm }: { searchTerm: string }) => {
  return (
    <div
      className="absolute bg-opacity-95 left-0 top-0 -z-10 w-[100%] rounded-2xl border border-2 border-[rgb(228,197,255)]  bg-[rgb(250,250,250)] bg-opacity-100  px-4  pt-[45px]  lg:border-[rgba(0,0,0,0.05)]"
      // style={{
      //   boxShadow:
      //     "inset 0 -2px 2px -2px rgba(29, 64, 76, 0.25), 0px 10px 12px rgba(0, 0, 0, 0.1), 0px 5px 2px rgba(169, 134, 206, 0.2), -5px 5px 5px rgba(169, 134, 206, 0.2)",
      // }}
    >
      {searchTerm !== "" ? (
        <div className="flex items-center justify-center  gap-2 px-1 py-4">
          <span className="text-gray-400">
            You currently have no transactions.
          </span>
        </div>
      ) : (
        <>
          <div className="flex min-h-[200px] flex-col items-start  justify-start px-2 pt-2">
            <span className="text-sm text-white">start typing to search</span>
          </div>
        </>
      )}
    </div>
  );
};

export const StyledTokenRow = styled.div<{
  first?: boolean;
  last?: boolean;
  loading?: boolean;
}>`
  background-color: transparent;
  display: grid;
  grid-template-columns: 2fr 4fr 2fr 2fr;
  padding: 16px;
  width: 100%;
`;

const InputDropdown = ({ searchTerm }: { searchTerm: string }) => {
  return <InputDrowdownSkeleton searchTerm={searchTerm} />;
};

const TokenSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropDownActive, setDropdownActive] = useState<boolean>(false);

  const handleOnBlur = useCallback(() => {
    setTimeout(() => {
      setDropdownActive(false);
    }, 100);
  }, []);

  return (
    <BoxItemContainer allignment={"center"} style={{ zIndex: 999 }}>
      <div
        className={`z-12 relative flex h-[45px] w-fit max-w-[100%] items-center   justify-center rounded-2xl border border-transparent bg-[rgb(255,255,255,0.2)] bg-opacity-50 px-4  hover:border-[rgb(237,95,245)] hover:border-[rgb(247,110,255)] focus:outline-none group-focus-within:border-blue-500 group-hover:border-blue-500 lg:w-full  ${
          dropDownActive && "border-0"
        } `}
      >
        <UilSearch className={ `${dropDownActive ? 'text-gray-800' : 'text-grey-400'} mr-2 h-6 w-6`} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`font-500 flex-1 bg-transparent text-[16px]   font-medium tracking-wide outline-none  ${dropDownActive ? 'text-gray-800 placeholder:text-gray-800' : 'placeholder:text-white text-white'}`}
          placeholder={"Search transactions by token"}
          onFocus={() => setDropdownActive(true)}
          onBlur={handleOnBlur}
          // onMouseEnter={}
        />
        {dropDownActive && <InputDropdown searchTerm={searchTerm} />}
      </div>
    </BoxItemContainer>
  );
};
const ROUTES: string[] = ["swap", "history"];

export const Navbar = () => {
  const { address: account, isConnected: active } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { pendingTransaction } = useTransactionFlow();

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
        <TokenSearchBar />

        <BoxItemContainer allignment={"flex-end"}>
          <div className="flex h-full items-center justify-center">
            <ChainSelect />
          </div>
          <div className="mx-5 flex  h-full items-center">
            <PrimaryButton
              className=" py-[6px] hover:bg-[rgb(249,135,177)]"
              onClick={async () => {
                !active ? enableConnection() : closeConnection();
              }}
            >
              <span className="mr-2 hidden bg-transparent xs:block">
                {pendingTransaction
                  ? "Pending"
                  : active
                    ? shortenAddress(account)
                    : "Connect"}
              </span>

              {active &&
                !pendingTransaction && (
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
                  </>,
                )}
              {pendingTransaction && <SpinningLoader />}
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
            href={`/${route === "swap" ? "" : route}`}
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
