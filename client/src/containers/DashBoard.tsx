import React, { useState, useEffect, useCallback } from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { httpClient } from "../utils/asyncUtils";
import { Event } from "../models/event";
import Map from "../components/GoogleMap";
import SessionsByDay from "../components/SessionByDayChart";
import SessionsByHour from "../components/SessionByhourChart";
import Logs from "../components/Logs";
import RetentionCohort from "../components/Retention";
import {
  Wrapper,
  StyledMap,
  LeftChart,
  RightChart,
  StyledCohort,
  StyledLog,
  Charts,
} from "./Dashboard.style";
import ErrorBoundary from "../components/ErrorBoundry";
export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const fetchAllEvents = async () => {
    try {
      const { data }: any = await httpClient.get("http://localhost:3001/events/all");
      console.log(data);
      setAllEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);
  return (
    <Wrapper>
      <ErrorBoundary>
        <StyledMap>{allEvents ? <Map allEvents={allEvents} /> : <h1>loading map</h1>}</StyledMap>
      </ErrorBoundary>
      <Charts>
        <ErrorBoundary>
        <LeftChart>
          <SessionsByDay />
          </LeftChart>
        </ErrorBoundary>
        <ErrorBoundary>
          <RightChart>
          <SessionsByHour />
          </RightChart>
        </ErrorBoundary>
      </Charts>
      <StyledCohort>
        <ErrorBoundary>
          <Logs />
        </ErrorBoundary>
      </StyledCohort>
      <StyledLog>
        <ErrorBoundary>
          <RetentionCohort />
        </ErrorBoundary>
      </StyledLog>
    </Wrapper>
  );
};

export default DashBoard;
