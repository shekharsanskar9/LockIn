# 🔒☀️ LockIn

A bright, positive planner for your **day, week and month**. Start from a proven routine
template, adjust it every week, tick tasks off, and get a **sunshine score (0–100)** with
strong points, weak points and pre-made advice for your score range.

Stack: React 19 + Vite, plain CSS, data kept in `localStorage` (no backend needed).

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/ (opens from any static host)
npm test          # scoring unit tests
```

## How it works

- **Templates** (`src/data/content.js`): Sunrise Starter, Student Focus, Professional Balance,
  Wellness & Fitness, Creator & Side Project, Blank Canvas. Pick one for a week, then edit,
  add or delete any task (time, area, priority, repeat days).
- **Weekly plans**: edits apply to that week; weeks you have not opened yet inherit your latest
  plan. "Copy last week's plan" and "Change template" are in the Week tab.
- **Score**: every task has a weight (★ 1, ★★ 2, ★★★ 3). Score = completed weight ÷ planned weight × 100,
  for a day, a week or a month (future days are ignored).
- **Score ranges → suggestions** (`BANDS` in `content.js`):
  90+ Radiant · 75+ Glowing · 60+ Steady Sunrise · 40+ Warming Up · 0+ Fresh Dawn.
- **Strong / weak points**: each life area (Body, Mind, Focus, Health, Growth, Joy) is strong at 75%+
  and weak below 60%. Also shown: most-skipped tasks, best/toughest day, morning/afternoon/evening
  rhythm, discipline (% of days at 60+), day streak, and change vs previous week/month.
- Backup/restore as JSON from the ⚙️ settings.

## Project layout

```
src/data/content.js     templates, score bands, advice, quotes (edit this to customise)
src/lib/scoring.js      pure scoring + review logic (tested in tests/)
src/lib/storage.js      persistence - swap localStorage for fetch() to a FastAPI backend
src/lib/usePlanner.js   state + actions hook
src/components/         Views (Day/Week/Month/Templates/Guide), Review, Modals, parts
```

## Connecting your Python backend later

Everything persisted is one JSON object (see the comment at the top of `scoring.js`).
Replace `loadState` / `saveState` in `src/lib/storage.js` with `GET/PUT /api/state`
(or split into endpoints per week/day) and the rest of the app stays the same.
