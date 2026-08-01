# Kairos frontend

React + Vite + Tailwind + Recharts, built to talk to *your* FastAPI backend
(`main.py`, `agent.py`, `fusion_engine.py`, `db.py`) with no shape mismatches.

## Run it

```bash
npm install
npm run dev
```

Make sure the backend is running first (`uvicorn app.main:app --reload --port 8000`
from your `backend/` folder), and that `.env.local` points at it:

```
VITE_API_URL=http://localhost:8000
```

## Endpoint contract (matches `main.py` exactly)

| Screen | Call | Request | Response |
|---|---|---|---|
| Onboarding | `POST /api/onboard` | `{ future_self_statement }` | `{ pillars: string[] }` |
| Dashboard → Today's Pick | `POST /api/recommend` | `{ pillars, user_moment, drift_detected }` | `{ pillar, recommendation_type, content, rationale }` |
| Journal | `POST /api/journal` | `{ text, pillar_names, pillar_ids }` | `{ mastery_deltas }` |
| Future Self | `POST /api/twin-message` | `{ future_self_statement, pillars, user_note }` | `{ message }` |
| Timeline | `GET /api/timeline?user_id=` | — | `{ points }` |
| Opportunities | `POST /api/opportunities` | `{ future_self_statement, pillars, mastery_threshold }` | `{ opportunities }` |

All decision logic (`pick_weakest_priority_pillar`, `pick_recommendation_type`,
`pick_eligible_opportunities`) and all Gemini calls run **server-side**, in
your `fusion_engine.py` / `agent.py`. The frontend doesn't duplicate any of
that logic — it just renders what the backend returns.

## One real gap in the current backend, and how this frontend works around it

`models.py` defines `UserCreate`, `FutureSelfCreate`, and `PillarCreate`, but
`main.py` has no endpoints that use them — there's no `POST` that actually
writes a user, a future self, or a pillar row into Supabase. That means:

- `/api/journal`'s optional `pillar_ids` map (`{pillar_name: supabase_uuid}`)
  can never be supplied by a real frontend today, since no pillar UUIDs
  exist yet. This app sends `pillar_ids: null`, which `main.py` already
  handles gracefully — Supabase writes are skipped, and the endpoint still
  returns `mastery_deltas`, which this app applies to pillar state client-side
  (kept in `localStorage`, not lost on refresh).
- `/api/timeline` reads `future_selves → pillars → mastery_history` in
  Supabase for a `user_id`. Since nothing ever created those rows, it will
  correctly return `{ points: [] }` for any user. `GrowthTimeline.jsx` calls
  the real endpoint first and only falls back to its own local session log
  (built from the real `mastery_deltas` responses above) if Supabase comes
  back empty — so the chart still shows real data, and automatically
  switches to the live Supabase-backed timeline the moment those write
  endpoints exist.

To close this gap for real (recommended before a live demo that needs
persistence across devices/sessions): add `POST /api/users`,
`POST /api/future-selves`, and `POST /api/pillars` to `main.py`, wired to
`models.py`'s existing schemas and `db.py`'s `supabase` client, and call them
once at the end of `handleOnboardDone` in `App.jsx`.

## Structure

```
src/
  api.js                     one function per backend endpoint
  App.jsx                    state + screen routing, localStorage persistence
  components/
    Onboarding.jsx           POST /api/onboard
    PillarCard.jsx           mastery ring + priority weight
    TodaysPick.jsx           POST /api/recommend
    JournalPanel.jsx         POST /api/journal
    OpportunitiesPanel.jsx   POST /api/opportunities
    TwinChat.jsx             POST /api/twin-message
    GrowthTimeline.jsx       GET /api/timeline (+ local fallback)
    NavBar.jsx
```
