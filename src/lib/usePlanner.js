import { useCallback, useEffect, useMemo, useState } from 'react';
import { addDays, fmt, parse, uid, weekDates } from './dates.js';
import { loadState, saveState, freshState } from './storage.js';
import { templateTasks, weekTasks } from './scoring.js';

const cloneTasks = (tasks) => tasks.map((t) => ({ ...t, days: [...t.days] }));

export function usePlanner() {
  const [state, setState] = useState(loadState);
  useEffect(() => saveState(state), [state]);
  const update = useCallback((fn) => setState((s) => fn(structuredClone(s))), []);

  const actions = useMemo(() => ({
    toggle: (dateStr, id) => update((s) => {
      const log = (s.logs[dateStr] ||= {});
      if (log[id]) delete log[id]; else log[id] = 1;
      if (!Object.keys(log).length) delete s.logs[dateStr];
      return s;
    }),

    saveTask: (wk, task) => update((s) => {
      const tasks = cloneTasks(weekTasks(s, wk));
      const i = tasks.findIndex((t) => t.id === task.id);
      if (i >= 0) tasks[i] = task; else tasks.push({ ...task, id: uid() });
      s.weeks[wk] = { tasks };
      return s;
    }),

    deleteTask: (wk, id) => update((s) => {
      s.weeks[wk] = { tasks: cloneTasks(weekTasks(s, wk)).filter((t) => t.id !== id) };
      return s;
    }),

    applyTemplate: (wk, tplId) => update((s) => {
      s.weeks[wk] = { tasks: templateTasks(tplId) };
      weekDates(parse(wk)).forEach((d) => delete s.logs[fmt(d)]);
      s.templateId = tplId;
      s.onboarded = true;
      return s;
    }),

    copyLastWeek: (wk) => update((s) => {
      const prev = fmt(addDays(parse(wk), -7));
      s.weeks[wk] = { tasks: cloneTasks(weekTasks(s, prev)) };
      return s;
    }),

    setNote: (dateStr, text) => update((s) => {
      if (text.trim()) s.notes[dateStr] = text; else delete s.notes[dateStr];
      return s;
    }),

    setName: (name) => update((s) => { s.name = name; return s; }),
    replaceAll: (next) => setState(next),
    reset: () => setState({ ...freshState() }),
  }), [update]);

  return { state, ...actions };
}
