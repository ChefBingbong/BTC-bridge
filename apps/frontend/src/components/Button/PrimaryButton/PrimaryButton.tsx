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
      className={`flex items-center rounded-2xl px-5 text-center font-semibold text-gray-500 ${variant === "secondary" ? "bg-[rgb(200,245,230)]" : "bg-[rgb(219,105,147)]"} ${className} focus-visible:ring-primary  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
      disabled={disabled || loading}
      style={{
        boxShadow:
          "inset 0px -2px 3px 0px rgba(75, 182, 146, 0.65), inset 0px 2px 3px 0px rgba(255,255,255, 0.65)",
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
