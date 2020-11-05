import styled, { createGlobalStyle } from 'styled-components';

export {}


export const Wrapper = styled.div`
    width: 100%;
   height: 100vh;
  display: grid;
  grid-template-areas:
    "map map"
    "charts charts"
    "cohort cohort"
    "log log"    

;
  /* grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr; */
`

export const StyledMap = styled.div`
  grid-area: map;
  padding: 5px;
`;
export const Charts = styled.div`
justify-content: space-between;
width: 100%;
 display: flex;
`;
export const RightChart = styled.div`
  grid-area: rightChart;
  padding: 5px;
`;
export const LeftChart = styled.div`
  grid-area: rightChart;
  padding: 5px;
`;
export const StyledCohort = styled.div`
  grid-area: cohort;
  padding: 5px;
`;
export const StyledLog = styled.div`
  grid-area: log;
  padding: 5px;
`;