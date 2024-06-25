import jazzicon from "@metamask/jazzicon";
import { useLayoutEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

const StyledIdenticon = styled.div<{ iconSize: number }>`
  height: ${({ iconSize }: any) => `${iconSize}px`};
  width: ${({ iconSize }: any) => `${iconSize}px`};
  border-radius: 50%;
  background-color: ${({ theme }: any) => theme.deprecated_bg4};
  font-size: initial;
`;

export default function Identicon({ size }: { size?: number }) {
  const { address: account } = useAccount();
  const iconSize = size ?? 18;

  const icon = useMemo(
    () =>
      account && jazzicon(iconSize, Number.parseInt(account.slice(2, 10), 16)),
    [account, iconSize],
  );
  const iconRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const current = iconRef.current;
    if (icon) {
      current?.appendChild(icon);
      return () => {
        try {
          current?.removeChild(icon);
        } catch (e) {
          console.error("Avatar icon not found");
        }
      };
    }
    return;
  }, [icon]);

  return (
    <StyledIdenticon iconSize={iconSize}>
      <span ref={iconRef} />
    </StyledIdenticon>
  );
}
