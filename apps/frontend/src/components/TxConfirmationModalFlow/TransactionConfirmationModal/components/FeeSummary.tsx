interface IFeeSummary {
  text: string;
  asset: any;
}

interface IFeeSummaryItem {
  title: string;
  titleValue: JSX.Element | string;
  subTitle: string;
  subTitleValue: JSX.Element | string;
}

const FeeSummaryItem = ({
  title,
  titleValue,
  subTitle,
  subTitleValue,
}: IFeeSummaryItem) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <span className="text-gray-400">{title}</span>
        <span className="">{titleValue}</span>
      </div>
      <div className="flex flex-row items-center justify-between">
        <span className="text-gray-400">{subTitle}</span>
        <span className="">
          <span>{subTitleValue}</span> Gwei
        </span>
      </div>
    </div>
  );
};

const FeeSummary = ({ text, asset }: IFeeSummary) => {
  return (
    <div className="my-1 mb-2 flex flex-col rounded-xl border border-[rgb(231,227,235)] bg-[#eeeaf4] px-4 py-2 text-[14px]">
      <FeeSummaryItem
        title={"Expected Output"}
        titleValue={text}
        subTitle={"Network Fee"}
        subTitleValue={"100"}
      />
      <div className="my-2 h-[1.2px] w-full bg-gray-600" />
      <FeeSummaryItem
        title={"Expected bridge tx fee"}
        titleValue={<span>{`0.00 ${asset.Icon}`}</span>}
        subTitle={"0.00%"}
        subTitleValue={asset.Icon}
      />
    </div>
  );
};

export default FeeSummary;
