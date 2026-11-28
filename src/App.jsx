import { useEffect, useState } from 'react';
import { QUOTES } from './data/content.js';
import { fmt, parse, seedOf, todayDate, wkKey, weekDates } from './lib/dates.js';
import { dayStats } from './lib/scoring.js';
import { exportJSON, importJSON } from './lib/storage.js';
import { usePlanner } from './lib/usePlanner.js';
import { ConfirmModal, Onboarding, SettingsModal, TaskModal } from './components/Modals.jsx';
import { DayView, GuideView, MonthView, TemplatesView, WeekView } from './components/Views.jsx';

const TABS = [
  ['day', '☀️ Day'], ['week', '🗓️ Week'], ['month', '🌙 Month'],
  ['templates', '🎨 Templates'], ['guide', '🏆 Score guide'],
];

function burst() {
  const wrap = document.createElement('div');
  wrap.className = 'burst';
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('span');
    s.textContent = ['☀️', '✨', '🌼', '🌟', '💛'][i % 5];
    const a = (i / 26) * Math.PI * 2;
    const r = 120 + Math.random() * 220;
    s.style.setProperty('--dx', `${Math.cos(a) * r}px`);
    s.style.setProperty('--dy', `${Math.sin(a) * r - 80}px`);
    wrap.appendChild(s);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 1500);
}

export default function App() {
  const p = usePlanner();
  const [today, setToday] = useState(todayDate);
  const [tab, setTab] = useState('day');
  const [date, setDate] = useState(todayDate);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');

  // roll over at midnight
  useEffect(() => {
    const id = setInterval(() => setToday((t) => (fmt(t) === fmt(todayDate()) ? t : todayDate())), 60000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 2600); return () => clearTimeout(id); }, [toast]);

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const quote = QUOTES[seedOf(today) % QUOTES.length];
  const close = () => setModal(null);

  const onToggle = (ds, id) => {
    const d = parse(ds);
    if (d > today) return setToast('This task unlocks on its day. Plan now, shine then! ☀️');
    const st = dayStats(p.state, d);
    const t = st.tasks.find((x) => x.id === id);
    const wasDone = !!p.state.logs[ds]?.[id];
    if (!wasDone && t && st.done + t.w === st.tot) { burst(); setToast('Perfect day! 100% 🌞'); }
    p.toggle(ds, id);
  };

  const onEdit = (task, ds) => setModal({ type: 'task', task, ds });
  const onAdd = (ds, days) => setModal({ type: 'task', task: null, ds, days });

  const useTemplate = (tpl) => {
    const wk = wkKey(date);
    const hasTicks = weekDates(parse(wk)).some((d) => p.state.logs[fmt(d)]);
    const go = () => { p.applyTemplate(wk, tpl.id); close(); setTab('week'); setToast(`${tpl.name} is ready for this week ✨`); };
    if (!p.state.onboarded || !hasTicks) go();
    else setModal({ type: 'confirm', title: 'Replace this week\'s plan?', text: `This swaps the week's tasks for "${tpl.name}" and clears this week's ticks.`, onYes: go });
  };

  const askCopyWeek = (wk) => setModal({
    type: 'confirm', title: 'Copy last week\'s plan?', yes: 'Copy plan',
    text: 'This replaces this week\'s tasks with last week\'s plan. Your ticks stay.',
    onYes: () => { p.copyLastWeek(wk); close(); setToast('Last week\'s plan copied 📋'); },
  });

  const goDay = (d) => { setDate(d); setTab('day'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const changeTab = (t) => setTab(t);

  const common = { p, today, date, setDate, onToggle, onEdit, onAdd, goDay };

  return (
    <>
      <div className="sky" aria-hidden="true">
        <div className="sun" /><span className="cloud c1" /><span className="cloud c2" /><span className="cloud c3" />
      </div>

      <header className="top">
        <div className="brand"><span className="logo">☀️</span><b>LockIn</b></div>
        <nav aria-label="Main">
          {TABS.map(([id, label]) => (
            <button key={id} className={`tab ${tab === id ? 'on' : ''}`} aria-current={tab === id ? 'page' : undefined}
              onClick={() => changeTab(id)}>{label}</button>
          ))}
        </nav>
        <button className="icon-btn big" aria-label="Settings" onClick={() => setModal({ type: 'settings' })}>⚙️</button>
      </header>

      <main>
        <section className="hero">
          <h1>{greet}, {p.state.name || 'sunshine'}! 🌻</h1>
          <p>“{quote}”</p>
        </section>

        {tab === 'day' && <DayView {...common} />}
        {tab === 'week' && <WeekView {...common} goTemplates={() => setTab('templates')} askCopyWeek={askCopyWeek} />}
        {tab === 'month' && <MonthView {...common} />}
        {tab === 'templates' && <TemplatesView p={p} onUse={useTemplate} />}
        {tab === 'guide' && <GuideView />}
      </main>

      <footer className="foot">Made with sunshine ☀️ · small steps, bright days</footer>

      {!p.state.onboarded && <Onboarding onPick={useTemplate} onSkip={() => p.applyTemplate(wkKey(date), 'sunrise')} />}
      {modal?.type === 'task' && (
        <TaskModal
          task={modal.task} defaultDays={modal.days} onClose={close}
          onSave={(t) => { p.saveTask(wkKey(parse(modal.ds)), t); close(); setToast('Saved ✨'); }}
          onDelete={(t) => { p.deleteTask(wkKey(parse(modal.ds)), t.id); close(); setToast('Task removed'); }}
        />
      )}
      {modal?.type === 'confirm' && <ConfirmModal {...modal} onClose={close} />}
      {modal?.type === 'settings' && (
        <SettingsModal
          name={p.state.name} onName={p.setName} onClose={close}
          onExport={() => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([exportJSON(p.state)], { type: 'application/json' }));
            a.download = `lockin-backup-${fmt(today)}.json`; a.click(); URL.revokeObjectURL(a.href);
          }}
          onImport={(txt) => { try { p.replaceAll(importJSON(txt)); close(); setToast('Backup restored 🌈'); } catch (e) { setToast(e.message); } }}
          onReset={() => setModal({ type: 'confirm', title: 'Reset everything?', yes: 'Yes, reset', text: 'All plans, ticks and notes will be erased from this browser.', onYes: () => { p.reset(); close(); } })}
        />
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
