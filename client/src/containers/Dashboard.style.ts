import styled, { createGlobalStyle } from "styled-components";

const size = {
  xs: 320,
  sm: "768px",
  lg: "1200px",
};
const device = {
  xs: `(min-width: ${size.xs})`,
  sm: `(min-width: ${size.sm})`,
  lg: `(min-width: ${size.lg})`,
};

export const Wrapper = styled.div`
  @media  (min-width: 320px) {
    font-size: 8px;
    display: "flex";
    padding:5px;
    flex-direction: column;
  }
  @media (min-width: 768px) {
    font-size: inherit;
    height: 100vh;
    padding:5px;
    display: flex;
  }
`;

export const StyledMap = styled.div`
`;
export const Charts = styled.div`
  @media  (min-width: 320px) {
    display: "flex";
    flex-direction: column;
    padding:10px;
  }
  @media (min-width: 900px) {
    display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1fr;
  justify-content: space-around;
  padding:10px;
  }
  
`;
export const RightChart = styled.div`
   border: 1px solid black;
   padding:10px;
`;
export const LeftChart = styled.div`
  border: 1px solid black;
  padding:10px;
`;
export const StyledCohort = styled.div`
  border: 1px solid black;
  padding:10px;
`;
export const StyledLog = styled.div`
  border: 1px solid black;
  padding:10px;
  
`;
