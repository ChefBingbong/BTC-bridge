import styled, { css } from "styled-components";
import HeaderRow from "./HeaderRow";
import TransactionRow from "./TransactionRow";
import { StyledTokenRow } from "./HeaderRow";
import { keyframes } from "styled-components";
import { useAccount } from "wagmi";

export const loadingAnimation = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const MAX_WIDTH_MEDIA_BREAKPOINT = "1200px";

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  // background-color: white;
  // box-shadow:
  //   0px 0px 1px rgba(0, 0, 0, 0.01),
  //   0px 4px 8px rgba(0, 0, 0, 0.04),
  //   0px 16px 24px rgba(0, 0, 0, 0.04),
  //   0px 24px 32px rgba(0, 0, 0, 0.01);
  background: rgb(248, 240, 255, 0.6);

  box-shadow:
    inset 1px -2px 3px 1px rgba(184, 152, 233, 0.65),
    inset 1px 2px 3px 0px rgba(255, 255, 255, 0.65);
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  /* justify-content: center; */
  align-items: center;
  border: 1px solid rgb(231, 227, 235);
`;

export type UserTxType = {
  Id: string;
  account: string;
  amount: string;
  chain: string;
  Ethereum: string;
  currency: string;
  BTC: string;
  date: number;
  status: string;
  completed: string;
  txHash: string;
  txType: string;
  deposit: string;
};

export const GlowingText = styled.div`
  font-size: 35px;
  width: 100%;
  height: 80%;
  border-radius: 12px;
  animation-fill-mode: both;
  background: ${(props: any) =>
    props.loading
      ? `linear-gradient(
    to left,
    rgb(179, 223, 228) 25%,
    rgb(233, 247, 247) 50%,
    rgb(182, 212, 224) 75%
  )`
      : "white"};
  will-change: background-position;
  background-size: 400%;

  color: transparent;

  ${(props: any) =>
    props.loading &&
    css`
      animation: ${loadingAnimation} 1s infinite;
    `}
`;

interface TransactionTableProps {
  filteredChain: any;
  filteredStatus: any;
  filteredType: any;
}

export default function TransactionsTable() {
  const { address: account } = useAccount();
  const txs = [];
  if (!txs)
    return (
      <GridContainer>
        <HeaderRow />
        <div className="w-full border-[0.5px] border-gray-800" />
        {["1", "2", "3", "5", "6", "1", "2", "3", "5", "6"].map(
          (item: any, index: number) => {
            return (
              <StyledTokenRow key={index}>
                <div className="flex w-[90%] items-center gap-2 text-blue-600">
                  <GlowingText loading={true}>
                    <div className=" h-5 w-5 rounded-full" />
                  </GlowingText>
                </div>
                <div className="flex w-[90%] items-center gap-2">
                  <GlowingText loading={true}>
                    <div className=" h-5 w-5 rounded-full" />
                  </GlowingText>
                </div>
                <div className="flex w-[90%] items-center gap-2">
                  <GlowingText loading={true}>
                    <div className=" h-5 w-5 rounded-full" />
                  </GlowingText>
                </div>
                <div className="flex w-[80%] items-center gap-2">
                  <GlowingText loading={true}>
                    <div className=" h-5 w-5 rounded-full" />
                  </GlowingText>
                </div>
              </StyledTokenRow>
            );
          },
        )}
      </GridContainer>
    );
  if (txs.length == 0)
    return (
      <GridContainer>
        <HeaderRow />
        <div className="my-4 flex justify-center">
          <span className="text-gray-400">
            You currently have no trasnactions.
          </span>
        </div>
      </GridContainer>
    );

  return (
    <GridContainer>
      <HeaderRow />
      <div className="w-full border-[0.5px] border-[rgb(231,227,235)]" />
      {txs
        .filter((tx: any) => tx.account === account!)
        .map((data: any) => {
          if (txs.length === 0)
            <div className="mt-4 flex justify-center">
              <span className="text-gray-400">
                You currently have no trasnactions.
              </span>
            </div>;
          return <TransactionRow key={data.Id} {...data} />;
        })}
    </GridContainer>
  );
}
