# Panera Sips Club Countdown

A TypeScript React app with a REST API that tracks your Panera Unlimited Sip Club drink cooldown.

## Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React 18 + TypeScript + Vite      |
| Styling   | Tailwind CSS v3                   |
| Icons     | lucide-react                      |
| Backend   | Express + TypeScript (tsx)        |
| Dev runner| concurrently                      |

## Project Structure

```
panera-sips-club/
├── server/
│   ├── index.ts              # Express entry point (port 3001)
│   └── routes/
│       └── sips.ts           # REST routes: GET /status, POST /claim, DELETE /reset
└── src/
    ├── types/
    │   └── sips.ts           # Shared TypeScript interfaces (SipsStatus, ClaimResponse, …)
    ├── services/
    │   └── sipsApi.ts        # REST API caller — typed fetch wrapper
    ├── hooks/
    │   └── useSipsClub.ts    # React hook: polls API, exposes claim/reset
    ├── components/
    │   └── CountdownRing.tsx # SVG countdown ring
    └── App.tsx               # Root component
```

## API Endpoints

| Method   | Path              | Description                          |
|----------|-------------------|--------------------------------------|
| `GET`    | `/api/sips/status`| Current availability, remaining time |
| `POST`   | `/api/sips/claim` | Record a drink claim (starts cooldown)|
| `DELETE` | `/api/sips/reset` | Clear the cooldown                   |

### GET /api/sips/status
```json
{
  "isAvailable": false,
  "lastClaim": "2025-08-30T14:32:00.000Z",
  "nextAvailable": "2025-08-30T16:32:00.000Z",
  "remainingMs": 4521000,
  "progressPercent": 37
}
```

### POST /api/sips/claim → 201
```json
{
  "success": true,
  "claimedAt": "2025-08-30T14:32:00.000Z",
  "nextAvailable": "2025-08-30T16:32:00.000Z"
}
```

## Running Locally

```bash
npm install
npm run dev          # starts both API (3001) and Vite (5173) together
```

Or run separately:
```bash
npm run dev:api      # Express API on :3001
npm run dev:web      # Vite dev server on :5173
```

## Environment

Copy `.env.example` to `.env` and adjust `VITE_API_BASE_URL` if your API is hosted elsewhere.

## Extending

- **Persistence**: swap the in-memory `lastClaim` in `server/routes/sips.ts` for Prisma + SQLite/Postgres.
- **Multi-user**: add a `userId` param / JWT auth so each person has their own cooldown.
- **Notifications**: use the Web Notifications API in `useSipsClub.ts` to alert when the drink is ready.
