import type { ReactNode } from "react";
import { FilterdNetworkWrapper, NetworkFilterOverlay } from "./styles";
import type { HtmlProps } from "next/dist/shared/lib/html-context.shared-runtime";

interface PopOverScreenProps {
  onClick: () => void;
  showPopover: boolean;
  children: ReactNode;
  props?: HtmlProps;
}

export const PopOverScreenContainer = ({
  onClick,
  showPopover,
  children,
  ...props
}: PopOverScreenProps) => {
  return (
    <>
      <NetworkFilterOverlay showPopOver={showPopover} onClick={onClick} />
      <FilterdNetworkWrapper showPopOver={showPopover} {...props}>
        {children}
      </FilterdNetworkWrapper>
    </>
  );
};
