// Pure scoring logic. No React in here, so it is easy to test and to port.
//
// state = {
//   templateId, startedOn: 'YYYY-MM-DD',
//   weeks: { 'YYYY-MM-DD(Monday)': { tasks: [{id,time,title,cat,w,days:[0..6]}] } },
//   logs:  { 'YYYY-MM-DD': { [taskId]: 1 } },   // ticked tasks per date
// }
import { BANDS, CATS, CAT_TIPS, TEMPLATES } from '../data/content.js';
import { addDays, dayIdx, fmt, wkKey } from './dates.js';

export const templateTasks = (id) => {
  const tpl = TEMPLATES.find((x) => x.id === id) || TEMPLATES[0];
  return tpl.tasks.map((task, i) => ({ ...task, days: [...task.days], id: `${tpl.id}-${i}` }));
};

// Tasks of a week. Weeks you never edited inherit the most recent earlier edited
// week (or the chosen template) without being stored. Ids are stable, so ticks survive.
export function weekTasks(state, key) {
  if (state.weeks[key]) return state.weeks[key].tasks;
  const earlier = Object.keys(state.weeks).filter((k) => k < key).sort();
  if (earlier.length) return state.weeks[earlier[earlier.length - 1]].tasks;
  return templateTasks(state.templateId);
}

export function tasksFor(state, d) {
  const i = dayIdx(d);
  return weekTasks(state, wkKey(d))
    .filter((t) => t.days.includes(i))
    .sort((a, b) => a.time.localeCompare(b.time) || a.title.localeCompare(b.title));
}

export const hasLogs = (state, d) => {
  const l = state.logs[fmt(d)];
  return !!l && Object.keys(l).length > 0;
};

// A day counts only if it is not in the future and falls after you began (or has ticks).
export const isTracked = (state, d, today) =>
  d <= today && (fmt(d) >= state.startedOn || hasLogs(state, d));

export function dayStats(state, d) {
  const tasks = tasksFor(state, d);
  const log = state.logs[fmt(d)] || {};
  let tot = 0, done = 0, nd = 0;
  for (const t of tasks) {
    tot += t.w;
    if (log[t.id]) { done += t.w; nd++; }
  }
  return { tasks, tot, done, n: tasks.length, nd, score: tot ? Math.round((done / tot) * 100) : null };
}

export const bandFor = (score) => (score == null ? null : BANDS.find((b) => score >= b.min));

const pick = (arr, n, seed) =>
  Array.from({ length: Math.min(n, arr.length) }, (_, i) => arr[(seed + i) % arr.length]);
const todOf = (time) => { const h = +time.slice(0, 2); return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'; };
const pct = (o) => (o.tot ? Math.round((o.done / o.tot) * 100) : null);

// Consecutive days (ending today, or yesterday if today is not yet good) scoring >= 60.
export function streak(state, today) {
  let d = today, n = 0;
  const s0 = dayStats(state, d).score;
  if (s0 == null || s0 < 60) d = addDays(d, -1);
  for (let i = 0; i < 400 && isTracked(state, d, today); i++) {
    const { score } = dayStats(state, d);
    if (score != null) { if (score < 60) break; n++; }
    d = addDays(d, -1);
  }
  return n;
}

// Full review of a list of dates: score, discipline, strong & weak points, advice.
export function review(state, dates, today, seed = 0) {
  const cats = Object.fromEntries(Object.keys(CATS).map((k) => [k, { tot: 0, done: 0 }]));
  const tod = { morning: { tot: 0, done: 0 }, afternoon: { tot: 0, done: 0 }, evening: { tot: 0, done: 0 } };
  const missed = {};
  const days = [];
  let tot = 0, done = 0, nT = 0, nD = 0, good = 0;

  for (const d of dates) {
    if (!isTracked(state, d, today)) continue;
    const st = dayStats(state, d);
    if (st.score == null) continue;
    days.push({ date: d, score: st.score });
    if (st.score >= 60) good++;
    tot += st.tot; done += st.done; nT += st.n; nD += st.nd;
    const log = state.logs[fmt(d)] || {};
    for (const t of st.tasks) {
      const ok = !!log[t.id];
      cats[t.cat].tot += t.w; tod[todOf(t.time)].tot += t.w;
      if (ok) { cats[t.cat].done += t.w; tod[todOf(t.time)].done += t.w; }
      const m = (missed[t.title] ||= { title: t.title, cat: t.cat, miss: 0, tot: 0 });
      m.tot++; if (!ok) m.miss++;
    }
  }

  if (!days.length) return { score: null, days, band: null };

  const score = Math.round((done / tot) * 100);
  const band = bandFor(score);
  const catList = Object.entries(cats)
    .filter(([, v]) => v.tot > 0)
    .map(([cat, v]) => ({ cat, pct: pct(v), done: v.done, tot: v.tot }));
  const strong = catList.filter((c) => c.pct >= 75).sort((a, b) => b.pct - a.pct);
  const weak = catList.filter((c) => c.pct < 60).sort((a, b) => a.pct - b.pct);

  const sortedDays = [...days].sort((a, b) => b.score - a.score);
  const bestDay = days.length >= 3 ? sortedDays[0] : null;
  const toughDay = days.length >= 3 && sortedDays[0].score !== sortedDays.at(-1).score ? sortedDays.at(-1) : null;

  const todPct = Object.fromEntries(Object.entries(tod).map(([k, v]) => [k, pct(v)]));
  const todKnown = Object.entries(todPct).filter(([, v]) => v != null).sort((a, b) => b[1] - a[1]);
  const rhythm = todKnown.length >= 2 && todKnown[0][1] - todKnown.at(-1)[1] >= 10
    ? { best: todKnown[0], worst: todKnown.at(-1) } : null;

  const mostMissed = Object.values(missed)
    .filter((m) => m.miss > 0)
    .sort((a, b) => b.miss / b.tot - a.miss / a.tot || b.miss - a.miss)
    .slice(0, 3);

  const tips = {
    band: pick(band.tips, 3, seed),
    cats: weak.slice(0, 2).map((w) => ({ cat: w.cat, text: pick(CAT_TIPS[w.cat].weak, 1, seed)[0] })),
  };

  return {
    score, band, days, tracked: days.length,
    consistency: Math.round((good / days.length) * 100),
    tasksDone: nD, tasksTotal: nT,
    catList, strong, weak, bestDay, toughDay, rhythm, mostMissed, tips,
  };
}

export const disciplineLabel = (c) =>
  c == null ? '-' : c >= 80 ? 'Rock solid' : c >= 60 ? 'Building well' : c >= 40 ? 'Finding rhythm' : 'Just beginning';
