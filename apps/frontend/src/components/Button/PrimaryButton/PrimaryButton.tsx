import { UilSpinnerAlt } from "@iconscout/react-unicons";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  type?: "submit" | "button" | "reset";
}

export const PrimaryButton = ({
  children,
  disabled,
  loading,
  variant = "primary",
  className = "",
  ...rest
}: Props) => {
  return (
    <button
      className={`flex items-center rounded-full px-5 text-center text-white ${variant === "secondary" ? "bg-[rgb(117,212,190)]" : "bg-[rgb(219,105,147)]"} ${className} focus-visible:ring-primary border-t border-[rgb(167,222,220)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
      disabled={disabled || loading}
      style={{
        boxShadow: "inset 0px -2.5px 0px 0px rgba(47,149,115, 0.65)",
      }}
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
