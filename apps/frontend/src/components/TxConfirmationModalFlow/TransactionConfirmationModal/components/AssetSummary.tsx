import { Currency } from "@pancakeswap/swap-sdk-core";
import { CurrencyLogo } from "~/components/CurrencyLogo/CurrencyLogo";

const AssetSummary = ({ currency }: { currency: Currency }) => {
  return (
    <div className="my-1 mb-1 flex items-center justify-between rounded-xl border border-[rgb(231,227,235)] bg-[#eeeaf4] p-4">
      <span className="text-[20px] font-semibold">
        {currency?.name ?? currency.symbol}
      </span>
      <div className="flex items-center justify-center gap-3">
        <CurrencyLogo currency={currency} />
        <div className="flex flex-col items-start justify-start text-center">
          <span className="text-[16px]">{currency.symbol}</span>
        </div>
      </div>
    </div>
  );
};

export default AssetSummary;
