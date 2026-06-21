# ApplyFlow

ApplyFlow is a lightweight Kanban board for tracking job applications from applied to offer. It helps job seekers see every opportunity, deadline, and next action in one place.

Current version: `0.1.5`

## Updates

- `0.1.5`: Added calendar export for application deadlines with Google Calendar links and downloadable `.ics` files.
- `0.1.4`: Added a weekly/monthly progress view with counts for applications added, interviews, take-home tests, rejections, and offers.
- `0.1.3`: Added search by company or role, filters for status and due soon/overdue deadlines, and sorting by deadline or recently updated.
- `0.1.2`: Improved the dashboard summary layout so metric cards use a two-column grid on smaller screens.
- `0.1.1`: Replaced the per-card status dropdown with drag-and-drop movement between Kanban stages.

## How to run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Who it is for

ApplyFlow is for developers and job seekers who are applying to multiple roles at the same time and need a simple way to avoid losing track of follow-ups, take-home deadlines, and interview stages.

## The one job it does well

It helps users see what stage each application is in and what they need to do next.

## Why this problem

Job search becomes messy once someone applies to more than a few companies. Spreadsheets work, but they require manual setup and are easy to ignore. This problem is common, specific, and small enough to solve with a focused prototype.

## What already exists

Tools like Notion, Trello, Huntr, and spreadsheets can track job applications. ApplyFlow focuses on one workflow: applications, deadlines, and next actions without setup.

## Scope

In scope:

- Add, edit, and delete applications
- Track status, deadline, next action, notes, and job URL
- View applications in a Kanban board
- Move applications between stages with drag-and-drop
- View weekly and monthly progress
- Search, filter, and sort applications
- Highlight upcoming and overdue deadlines
- Export deadlines to Google Calendar or `.ics` files
- Persist data in localStorage

Out of scope:

- Authentication
- Backend database
- Email reminders
- Two-way calendar sync
- Resume parsing
- AI job matching

These are left out to keep the prototype small and reliable within the 48-hour window.

## Assumptions

I assumed users are tracking their own applications on one device, so localStorage is enough for the prototype. I also assumed the most important fields are company, role, status, deadline, and next action.

## Three questions for real users

1. What information do you actually check every day during your job search?
2. When do you usually lose track: after applying, during interviews, or during take-home tests?
3. Would reminders or calendar sync be more valuable than deeper analytics?

## How I would know it is working

I would measure whether users keep returning to update applications, whether they complete follow-up actions on time, and whether they add most of their active job applications into the tracker.

## What I would do next

Next, I would add reminders, calendar export, cloud sync, and better mobile-friendly status movement once the core workflow is validated.

## AI usage

I used AI to help turn the product spec into the initial project structure, component breakdown, localStorage flow, and README draft. 
