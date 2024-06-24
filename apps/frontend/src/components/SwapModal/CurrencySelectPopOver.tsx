import { useCallback } from "react";
import { PopOverScreenContainer } from "../PopOverScreen/PopOverScreen";
import { Box, Text } from "@pancakeswap/uikit";
import { UilTimes } from "@iconscout/react-unicons";

export const CurrencySelectPopOver = ({
  setShowProvidersPopOver,
  showProivdersPopOver,
}: any) => {
  const showProvidersOnClick = useCallback(() => {
    setShowProvidersPopOver((p: boolean) => !p);
  }, [setShowProvidersPopOver]);

  return (
    <PopOverScreenContainer
      showPopover={showProivdersPopOver}
      onClick={showProvidersOnClick}
    >
      <div className="flex w-full items-center justify-between px-2">
        <Text fontSize="18px" fontWeight="600">
          Choose a Currency
        </Text>
        <UilTimes
          className="h-6 w-6 text-white hover:cursor-pointer"
          onClick={showProvidersOnClick}
        />
      </div>
    </PopOverScreenContainer>
  );
};
