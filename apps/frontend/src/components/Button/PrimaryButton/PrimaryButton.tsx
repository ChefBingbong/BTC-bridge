import { UilSpinnerAlt } from "@iconscout/react-unicons";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
}

export const PrimaryButton = ({
  children,
  disabled,
  loading,
  className = "",
  ...rest
}: Props) => {
  return (
    <button
      className={`flex items-center rounded-full px-5 text-center text-white ${disabled ? "bg-[rgba(219,105,147,0.5)]" : "bg-[rgb(219,105,147)]"} ${className} focus-visible:ring-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
      disabled={disabled || loading}
      {...rest}
    >
      {children}
      {loading && (
        <span className="ml-1 animate-spin">
          <UilSpinnerAlt />
        </span>
      )}
    </button>
  );
};

export default PrimaryButton;
