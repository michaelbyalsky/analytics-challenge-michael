///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import { getAllEvents, getWeekEvents, getEventsByHours, createEvent, getWeeklyRetention } from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

router.get("/all", (req: Request, res: Response) => {
  try {
    const allEventsData: any = getAllEvents();

    res.json(allEventsData);
  } catch (err) {
    console.error(err);
  }
});

router.get("/all-filtered", (req: Request, res: Response) => {
  try {
    const filters: Filter = req.query;
    let filteredData: any[] = getAllEvents();

    if (filters.search && filters.search !== "") {
      const reg: RegExp = new RegExp(filters.search, "i");
       filteredData = filteredData.filter((event) => {
         for (let key in event){           
          if(reg.test(event[key])) {
            return event
          }
        }
      })
    }

    if (filters.type) {
      filteredData = filteredData.filter((event: Event) => {
        return event.name === filters.type;
      });
    }

    if (filters.browser) {
      filteredData = filteredData.filter((event: Event) => {
        return event.browser === filters.browser;
      });
    }

    if (filters.sorting) {
      filteredData = filteredData.sort((event1: Event, event2: Event) => {
        return filters.sorting[0] === "+" ? event1.date - event2.date : event2.date - event1.date;
      });
    }

    const more = filteredData.length >= filters.offset;

    res.json({
      events: filteredData.slice(0, filters.offset),
      more,
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/by-days/:offset", (req: Request, res: Response) => {
  try {
    const offset: number = parseInt(req.params.offset);
    const totalEventsByDay = getWeekEvents(offset);
    res.json(totalEventsByDay);
  } catch (err) {
    console.error(err);
  }
});

router.get("/by-hours/:offset", (req: Request, res: Response) => {
  const offset: number = parseInt(req.params.offset);
  const filteredData = getEventsByHours(offset);
  res.send(filteredData);
});

router.get("/today", (req: Request, res: Response) => {
  res.send("/today");
});

router.get("/week", (req: Request, res: Response) => {
  res.send("/week");
});

const OneHour: number = 1000 * 60 * 60;
const OneDay: number = OneHour * 24;
const OneWeek: number = OneDay * 7;const today = new Date (new Date().toDateString()).getTime()+6*OneHour
const myDayZero = today-5*OneWeek

router.get("/retention", (req: Request, res: Response) => {
  const { dayZero } = req.query;
  
  let weeklyRetention = getWeeklyRetention(dayZero || myDayZero)
  res.json(weeklyRetention);
});


router.get("/:eventId", (req: Request, res: Response) => {
  res.send("/:eventId");
});

router.post("/", (req: Request, res: Response) => {
  try {
    const event: Event = req.body;
    createEvent(event);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get("/chart/os/:time", (req: Request, res: Response) => {
  res.send("/chart/os/:time");
});

router.get("/chart/pageview/:time", (req: Request, res: Response) => {
  res.send("/chart/pageview/:time");
});

router.get("/chart/timeonurl/:time", (req: Request, res: Response) => {
  res.send("/chart/timeonurl/:time");
});

router.get("/chart/geolocation/:time", (req: Request, res: Response) => {
  res.send("/chart/geolocation/:time");
});

export default router;
