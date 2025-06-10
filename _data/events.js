import Fetch from '@11ty/eleventy-fetch';
import { google } from 'googleapis';
import moment from 'moment';

export default function () {
  return Fetch(
    async function () {
      const calendar = google.calendar({
        version: 'v3',
        auth: process.env.GOOGLE_CALENDAR_API_KEY,
      });

      const timeMin = new Date();
      const timeMax = new Date();
      timeMax.setDate(timeMin.getDate() + 60);

      const res = await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return res.data.items.map((event) => {
        const start = moment(event.start.dateTime || event.start.date);
        const end = moment(event.end.dateTime || event.end.date);

        return {
          date: start.format('dddd, MMMM Do'),
          time: `${start.format('h:mm')} - ${end.format('h:mm a')}`,
          title: event.summary,
          description: event.description,
        };
      });
    },
    {
      requestId: 'calendar',
      duration: '12h',
    },
  );
}
