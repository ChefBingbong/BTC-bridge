import styled from "styled-components";
import { UilExclamationTriangle } from "@iconscout/react-unicons";

export const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const StyledTokenRow = styled.div`
  background-color: transparent;
  display: grid;
  font-size: 16px;
  grid-template-columns: 12fr 4fr 4fr 4fr;
  line-height: 24px;
  max-width: 1200px;
  min-width: 390px;
  padding: 15px 20px;
  width: 100%;

  @media (max-width: 1000px) {
    grid-template-columns: 8fr 4fr 4fr 4fr;
  }
  @media (max-width: 780px) {
    grid-template-columns: 10fr 4fr 4fr;
  }
      @media (max-width: 600px) {
    grid-template-columns: 10fr 5fr;
  }
`;

const HeaderRow = () => {
  return (
    <StyledTokenRow>
      <div className="text-gray-500">
        <span>Transaction Hash</span>
      </div>
      <div className="text-gray-500 hidden md2:block">
        <span>Date</span>
      </div>
      <div className="text-gray-500 hidden sm2:block">
        <span>Type</span>
      </div>
      <div className="text-gray-500">
        <span>amount</span>
      </div>
    </StyledTokenRow>
  );
};

export default HeaderRow;
