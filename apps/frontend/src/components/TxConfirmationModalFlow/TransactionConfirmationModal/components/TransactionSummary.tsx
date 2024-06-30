import { CurrencyLogo } from "~/components/CurrencyLogo/CurrencyLogo";

interface ITxSummary {
  fee: number;
  text: string;
  asset: any;
}

const TransactionSummary = ({ text, fee, asset }: ITxSummary) => {
  return (
    <div className="mb-4 mt-3 w-full break-words px-4 text-left text-[14px] text-gray-400">
      <span>
        output is estimated. You will receive at least{" "}
        <span>
          {Number(text) + Number(fee)}{" "}
          {
            <span>
              <CurrencyLogo currency={asset} />
            </span>
          }
        </span>{" "}
        from this transaction
      </span>
    </div>
  );
};

export default TransactionSummary;
