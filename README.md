# BlairPublicLibrary.org

The Blair Public Library is fantastic, their internet presence is not.

This is a little site to publish all the library events on a non-paywalled, non-Facebook, up to date site.

## Design

This is a one-page static site using 11ty.  It is backed by a Google Calendar, into which I put all of the events into based on the printed calendar from the libray.

It uses 11ty Fetch to grab this from Google, and format it into the page.  Sure, I could have embedded the calendar, but this is more interesting!

It refreshes nightly so that old events are removed from the page.  Hosting is via Cloudflare.
