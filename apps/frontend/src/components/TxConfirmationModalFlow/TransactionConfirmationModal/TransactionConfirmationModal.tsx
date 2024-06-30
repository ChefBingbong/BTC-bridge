import React, { useState, useCallback, useEffect } from "react";
import { UilAngleDown, UilTimes } from "@iconscout/react-unicons";
import PrimaryButton from "~/components/Button/PrimaryButton/PrimaryButton";
import AssetSummary from "./components/AssetSummary";
import FeeSummary from "./components/FeeSummary";
import TransactionSummary from "./components/TransactionSummary";
import ProtocolBanner from "./components/GasOptionSummary";
import styled from "styled-components";
import { Currency, TradeType } from "@pancakeswap/swap-sdk-core";
import { ChainLogo } from "~/components/CurrencyLogo/ChainLogo";
import { CurrencyLogo } from "~/components/CurrencyLogo/CurrencyLogo";
import SwapButton from "~/components/Button/SwapButton/SwapButton";
import { SmartRouterTrade } from "@pancakeswap/smart-router";
import {
  SmartWalletDetails,
  WalletAllownceDetails,
} from "@btc-swap/router-sdk";
import { FeeHistory } from "viem";
import { ButtonWrapper } from "~/components/SwapModal/styles";

export const FormWrapper = styled.div`
  position: fixed;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  background-color: rgb(13, 17, 28);
  text-align: right;
  padding: 30px 15px;
  padding-bottom: 20px;
  border-radius: 15px;
  display: block;
  z-index: 10000000000;
  border-radius: 24px;
  max-width: 400px;
  width: 100%;
  z-index: 1;
  border: 1px solid rgb(231, 227, 235);
  background: white;
  color: #280d5f;
  /* font-weight: 900; */
  /* padding: 20px; */
  position: relative;
`;

interface IAssetModalInner {
  asset: any;
  close: () => void;
  transactionType: string;
  text: string;
  executeTx: () => Promise<void>;
  trade: SmartRouterTrade<TradeType>;
  inAllowance: WalletAllownceDetails;
  outAllowance: WalletAllownceDetails;
  smartWalletDetails: SmartWalletDetails;
  fees: FeeHistory;
}

const TxModalInner = ({
  asset,
  text,
  transactionType,
  close,
  executeTx,
  trade,
  inAllowance,
  outAllowance,
  smartWalletDetails,
  fees,
}: IAssetModalInner) => {
  return (
    <>
      <div className={`mb-2 flex items-center ${"justify-between"} px-2`}>
        <span className="font-800 text-[17px]">Confirm Transaction</span>
        <div onClick={close}>
          <UilTimes className={" text-[1fc7d4] hover:cursor-pointer"} />
        </div>
      </div>
      <div className="relative flex flex-col">
        <AssetSummary currency={asset} />

        <div className="my-1 mb-1 flex items-center justify-between rounded-xl border border-[rgb(231,227,235)] bg-[#eeeaf4] p-4">
          <span className="text-[20px] font-semibold">
            {"BinanceSmartChain"}
          </span>
          <div className="flex items-center justify-center gap-3">
            <ChainLogo chainId={56} />
            <div className="flex flex-col items-start justify-start text-center">
              <span className="text-[16px]">{"Bsc"}</span>
            </div>
          </div>
        </div>
        <div className="absolute right-[45%] top-[37%] flex h-9 w-9 items-center justify-center rounded-xl border border-gray-600 bg-darkBackground">
          <UilAngleDown className={""} />
        </div>
      </div>
      <div className="my-2 px-4 text-left">
        <span>{`1 ${(
          <span>
            <CurrencyLogo currency={asset} />
          </span>
        )} = ${0.0012}`}</span>
      </div>
      <FeeSummary asset={asset} text={text} />
      <ProtocolBanner type={"standard"} />
      <TransactionSummary fee={0.2} asset={asset} text={text} />
      <ButtonWrapper>
        <PrimaryButton
          className="bg-[rgb(154,200,255)]! w-full items-center justify-center rounded-[14px] py-4 font-semibold hover:bg-[rgb(164,210,255)]"
          disabled={!trade}
          onClick={executeTx}
          variant="secondary"
        >
          {"Confirm Swap"}
        </PrimaryButton>
      </ButtonWrapper>
    </>
  );
};

interface IAssetModal {
  toggleConfirmationModal: () => void;
  trade: SmartRouterTrade<TradeType>;
  inAllowance: WalletAllownceDetails;
  outAllowance: WalletAllownceDetails;
  smartWalletDetails: SmartWalletDetails;
  asset: Currency;
  transactionType: string;
  executeTx: () => Promise<void>;
  open: boolean;
  fees: FeeHistory;
}

const TxConfirmationModal = ({
  toggleConfirmationModal,
  trade,
  inAllowance,
  outAllowance,
  smartWalletDetails,
  text,
  asset,
  transactionType,
  executeTx,
  open,
  fees,
}: IAssetModal) => {
  return (
    <FormWrapper>
      <TxModalInner
        asset={asset}
        text={text}
        transactionType={transactionType}
        close={toggleConfirmationModal}
        executeTx={executeTx}
        trade={trade}
        inAllowance={inAllowance}
        outAllowance={outAllowance}
        smartWalletDetails={smartWalletDetails}
        fees={fees}
      />
    </FormWrapper>
  );
};

export default TxConfirmationModal;
