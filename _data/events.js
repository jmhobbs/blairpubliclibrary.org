import Fetch from '@11ty/eleventy-fetch';
import { google } from 'googleapis';
import moment from 'moment-timezone';

export default function () {
  return Fetch(
    async function () {
      const calendar = google.calendar({
        version: 'v3',
        auth: process.env.GOOGLE_CALENDAR_API_KEY,
      });

      const now = moment().tz('America/Chicago');

      const res = await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        timeMin: now.startOf('day').toISOString(),
        timeMax: now.add(1, 'M').endOf('month').toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return res.data.items.map((event) => {
        const start = moment(event.start.dateTime || event.start.date).tz('America/Chicago');
        const end = moment(event.end.dateTime || event.end.date).tz('America/Chicago');

        return {
          allDay: event.start.date != undefined,
          date: start.format('dddd, MMMM Do'),
          time: `${start.format('h:mm a')} - ${end.format('h:mm a')}`,
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
