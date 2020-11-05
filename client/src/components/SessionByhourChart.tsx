import React, { useState, useEffect } from "react";
import { httpClient } from "../utils/asyncUtils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import TextField from "@material-ui/core/TextField";
import moment from "moment";

interface Session {
  hour: string;
  count: number;
}

const SessionByHour: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let chosenDate = moment(e.target.value);
    let currentDate = moment(new Date());
    var duration = Math.round(moment.duration(currentDate.diff(chosenDate)).asDays());
    console.log(duration);
    fetchSessions(duration - 1);
  };

  const fetchSessions = async (offset: number = 5) => {
    try {
      const { data }: any = await httpClient.get(`http://localhost:3001/events/by-hours/${offset}`);

      setSessions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  console.log(sessions);

  return (
    <div>
      <h1 className="header">Session By Hour</h1>
      <div className="dateWrapper">
        <TextField
          id="dateTextField"
          label="choose date"
          type="date"
          defaultValue={moment(new Date())}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <div className="chartWrapper">
        <LineChart
          width={500}
          height={300}
          data={sessions}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
    </div>
  );
};

export default SessionByHour;
