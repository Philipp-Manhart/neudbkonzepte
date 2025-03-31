# Neue DB Konzepte

A modern database concept implementation project. For DHBW Heidenheim.

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/Philipp-Manhart/neuedbkonzepte
   cd neudbkonzepte
   ```

2. Install dependencies:
   ```bash
   npm i --force
   ```

3. Run Redis server (in a separate terminal):
   ```bash
   redis-server
   ```
   This will start Redis on the standard port (6379).

4. Start the application:
   ```bash
   npm run dev
   ```

## Testing Guide

- Create a new User and create a poll with him.
- Go to "Meine Umfragen" and click on "Umfrage durchführen"
- Open incognito tab or other browser
- Login or stay anonymus
- Enter Poll Run Code on the homepage, which is displayed on the Creator Waiting Room
- Repeat 3-5 with desired amount of participants
- Hit "Umfrage starten" on Creator Page
- Vote with every Participant and watch live results
- After Poll:
- Participants check "Meine Teilnahmen" for the results (only if was logged in before entering the poll)
- Owner checks "Meine Durchläufe" for the results

## Technologies

- Next.js
- Redis
- TailwindCSS
- Shadcn/UI

