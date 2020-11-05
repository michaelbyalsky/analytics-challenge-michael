import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { httpClient } from "../utils/asyncUtils";
import { DataGrid } from "@material-ui/data-grid";
import { Event } from "../models/event";
import moment from "moment";
import { List, ListItem, ListItemText } from "@material-ui/core";

const columns = [
  { field: "id", headerName: "Id", width: 70 },
  { field: "userUniqueId", headerName: "User Unique ID", width: 130 },
  { field: "name", headerName: "Event Name", width: 130 },
  { field: "browser", headerName: "Browser", width: 130 },
  { field: "date", headerName: "Date", width: 130 },
  // {
  //   field: 'age',
  //   headerName: 'Age',
  //   type: 'number',
  //   width: 90,
  // },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  // },
];

interface FilteredEvent {
  id: number;
  userUniqueId: string;
  name: string;
  browser: string;
  date: string;
}

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [sorting, setSorting] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [browser, setBrowser] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState<string>("");

  const fetchLogs = async () => {
    try {
      const { data } = await httpClient.get(`http://localhost:3001/events/all`);
      // -filtered?sorting=${sorting}&type=${type}&browser=${browser}&search=${search}&offsFet=${offset}
      let filtered: FilteredEvent[] = [];
      data.forEach((event: Event, index: number) => {
        filtered.push({
          id: index,
          userUniqueId: event.distinct_user_id,
          name: event.name,
          browser: event.browser,
          date: moment(event.date).format("YYYY-MM-DD"),
        });
      });
      setLogs(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <h1>logs</h1>
      <div className="logsContainer">
       {logs && (
          <InfiniteScroll
            pageStart={0}
            loadMore={fetchLogs}
            hasMore={true}
            loader={
              <div className="loader" key={0}>
                Loading ...
              </div>
            }
      > 
        {/* {logs && (
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid rows={logs} columns={columns} pageSize={5} checkboxSelection />
          </div>
        )} */}
    
          <List style={{ height: "100px" }}>
            {logs && logs.map((log, i) => {
              return (
                <ListItem key={i}>
                  <ListItemText  primary={ `name: ${log.name} || date: ${log.date}`} />
                </ListItem>
              );
            })}
          </List>
        </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default Logs;
