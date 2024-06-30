import styled from "styled-components";

export const Nav = styled.nav`
  padding: 24px 16px;
  width: 100%;
  height: 84px;
  z-index: 12;
  box-sizing: border-box;
  display: block;
  // background-color: rgba(0, 0, 0, 0.03);
  box-shadow: 0px -1px 4px 0px rgba(184, 152, 233, 0.75);

  position: absolute;
`;

export const Box = styled.div`
  box-sizing: border-box;
  vertical-align: initial;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
`;

export const BoxItemContainer = styled.div<{ allignment: string }>`
  box-sizing: border-box;
  vertical-align: initial;
  -webkit-tap-highlight-color: transparent;
  justify-content: ${({ allignment }: { allignment: string }) => allignment};
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  width: 100%;
  align-items: center;
`;
