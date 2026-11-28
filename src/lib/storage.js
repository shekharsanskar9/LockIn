// Persistence layer. Today it is localStorage; to use your Python backend,
// replace these three functions with fetch() calls (e.g. FastAPI:
// GET /api/state, PUT /api/state) and keep everything else unchanged.
import { fmt, todayDate } from './dates.js';

const KEY = 'lockin.v1';

export const freshState = () => ({
  name: '', templateId: null, onboarded: false,
  startedOn: fmt(todayDate()), weeks: {}, logs: {}, notes: {},
});

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...freshState(), ...JSON.parse(raw) };
  } catch { /* ignore corrupted data */ }
  return freshState();
}

export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full/blocked */ }
}

export const exportJSON = (state) => JSON.stringify(state, null, 2);

export function importJSON(text) {
  const data = JSON.parse(text);
  if (typeof data !== 'object' || !data || typeof data.weeks !== 'object' || typeof data.logs !== 'object') {
    throw new Error('Not a LockIn backup file');
  }
  return { ...freshState(), ...data };
}
