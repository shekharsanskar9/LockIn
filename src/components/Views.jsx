import { useEffect, useState } from 'react';
import { BANDS, CATS, TEMPLATES } from '../data/content.js';
import { DAYS, addDays, dayIdx, fmt, longDate, monthDates, monthName, seedOf, shortDate, weekDates, weekStart, wkKey } from '../lib/dates.js';
import { bandFor, dayStats, isTracked, review, streak } from '../lib/scoring.js';
import { Empty, Ring, TaskRow } from './parts.jsx';
import Review from './Review.jsx';

function Nav({ title, sub, onPrev, onNext, onToday, todayLabel }) {
  return (
    <div className="date-nav">
      <button className="btn ghost round" onClick={onPrev} aria-label="Previous">‹</button>
      <div className="date-title"><h2>{title}</h2>{sub && <p>{sub}</p>}</div>
      <button className="btn ghost round" onClick={onNext} aria-label="Next">›</button>
      <button className="btn soft" onClick={onToday}>{todayLabel}</button>
    </div>
  );
}

/* ------------------------------ DAY ------------------------------ */
const GROUPS = [
  { id: 'morning', icon: '🌅', label: 'Morning', test: (h) => h < 12 },
  { id: 'afternoon', icon: '☀️', label: 'Afternoon', test: (h) => h >= 12 && h < 17 },
  { id: 'evening', icon: '🌙', label: 'Evening', test: (h) => h >= 17 },
];

export function DayView({ p, date, today, setDate, onToggle, onEdit, onAdd }) {
  const ds = fmt(date);
  const st = dayStats(p.state, date);
  const log = p.state.logs[ds] || {};
  const locked = date > today;
  const rv = review(p.state, [date], today, seedOf(date));
  const [note, setNote] = useState(p.state.notes[ds] || '');
  useEffect(() => setNote(p.state.notes[ds] || ''), [ds]); // eslint-disable-line react-hooks/exhaustive-deps
  const isToday = fmt(date) === fmt(today);
  const band = bandFor(st.score);

  return (
    <>
      <Nav
        title={isToday ? 'Today' : longDate(date)} sub={isToday ? longDate(date) : DAYS[dayIdx(date)] + (locked ? ' · upcoming' : '')}
        onPrev={() => setDate(addDays(date, -1))} onNext={() => setDate(addDays(date, 1))}
        onToday={() => setDate(today)} todayLabel="Today"
      />
      <div className="grid-day">
        <section className="card tasks">
          <div className="card-head">
            <h3>Plan for the day</h3>
            <button className="btn primary" onClick={() => onAdd(ds, [dayIdx(date)])}>+ Add task</button>
          </div>
          {locked && <p className="note-soft">🌤️ This day has not started. Shape the plan now, tick tasks when it arrives.</p>}
          {st.n === 0 && <Empty>No tasks planned. Add one, or pick a routine in <b>Templates</b>. ✨</Empty>}
          {GROUPS.map((g) => {
            const items = st.tasks.filter((t) => g.test(+t.time.slice(0, 2)));
            if (!items.length) return null;
            return (
              <div key={g.id} className="group">
                <h4>{g.icon} {g.label}</h4>
                {items.map((t) => (
                  <TaskRow key={t.id} task={t} dateStr={ds} done={!!log[t.id]} locked={locked} onToggle={onToggle} onEdit={onEdit} />
                ))}
              </div>
            );
          })}
          <label className="note">
            <span>📝 Today's win or gratitude</span>
            <textarea
              rows={2} value={note} placeholder="One good thing about today…"
              onChange={(e) => setNote(e.target.value)} onBlur={() => p.setNote(ds, note)}
            />
          </label>
        </section>

        <aside className="side">
          <section className="card score-card" style={band ? { '--band': band.color, '--bandbg': band.bg } : undefined}>
            <Ring score={st.score} />
            <p className="score-msg">
              {st.score == null ? 'Add tasks to start scoring.' : `${band.emoji} ${band.name}: ${st.nd} of ${st.n} tasks done`}
            </p>
          </section>
          <Review
            rv={rv} scope="today" streakDays={streak(p.state, today)}
            emptyText={locked ? 'This day is still ahead. Your review will bloom once you start ticking tasks. 🌸' : undefined}
          />
        </aside>
      </div>
    </>
  );
}

/* ------------------------------ WEEK ------------------------------ */
export function WeekView({ p, date, today, setDate, onToggle, onEdit, onAdd, goDay, goTemplates, askCopyWeek }) {
  const dates = weekDates(date);
  const ws = weekStart(date);
  const rv = review(p.state, dates, today, seedOf(ws));
  const prev = review(p.state, weekDates(addDays(ws, -7)), today).score;
  const isThisWeek = wkKey(date) === wkKey(today);
  return (
    <>
      <Nav
        title={isThisWeek ? 'This week' : `${shortDate(ws)} – ${shortDate(addDays(ws, 6))}`}
        sub={isThisWeek ? `${shortDate(ws)} – ${shortDate(addDays(ws, 6))}` : undefined}
        onPrev={() => setDate(addDays(date, -7))} onNext={() => setDate(addDays(date, 7))}
        onToday={() => setDate(today)} todayLabel="This week"
      />
      <div className="toolbar">
        <button className="btn soft" onClick={goTemplates}>🎨 Change routine template</button>
        <button className="btn soft" onClick={() => askCopyWeek(wkKey(date))}>📋 Copy last week's plan</button>
        <button className="btn primary" onClick={() => onAdd(fmt(dates[0]), [0, 1, 2, 3, 4, 5, 6])}>+ Add task</button>
      </div>
      <div className="week-board">
        {dates.map((d) => {
          const ds = fmt(d);
          const st = dayStats(p.state, d);
          const log = p.state.logs[ds] || {};
          const band = isTracked(p.state, d, today) ? bandFor(st.score) : null;
          const locked = d > today;
          return (
            <section key={ds} className={`card daycol ${ds === fmt(today) ? 'is-today' : ''}`}>
              <header>
                <button className="day-link" onClick={() => goDay(d)} title="Open this day">
                  <span>{DAYS[dayIdx(d)]}</span><b>{d.getDate()}</b>
                </button>
                <span className="pill" style={band ? { background: band.bg, color: '#5b4a1f' } : undefined}>
                  {band ? `${st.score}%` : locked ? '·' : '–'}
                </span>
              </header>
              {st.tasks.map((t) => (
                <TaskRow key={t.id} compact task={t} dateStr={ds} done={!!log[t.id]} locked={locked} onToggle={onToggle} onEdit={onEdit} />
              ))}
              <button className="add-mini" onClick={() => onAdd(ds, [dayIdx(d)])}>+ add</button>
            </section>
          );
        })}
      </div>
      <Review rv={rv} scope="this week" prevScore={prev} streakDays={streak(p.state, today)}
        emptyText="Tick off some tasks this week and your weekly review, with strong and weak points, will appear here. 🌼" />
    </>
  );
}

/* ------------------------------ MONTH ------------------------------ */
export function MonthView({ p, date, today, setDate, goDay }) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const dates = monthDates(first);
  const rv = review(p.state, dates, today, seedOf(first));
  const prevFirst = new Date(first.getFullYear(), first.getMonth() - 1, 1);
  const prev = review(p.state, monthDates(prevFirst), today).score;
  const weeks = [...new Set(dates.map((d) => wkKey(d)))];
  const isThis = first.getMonth() === today.getMonth() && first.getFullYear() === today.getFullYear();

  return (
    <>
      <Nav
        title={monthName(first)} sub={isThis ? 'This month' : undefined}
        onPrev={() => setDate(prevFirst)} onNext={() => setDate(new Date(first.getFullYear(), first.getMonth() + 1, 1))}
        onToday={() => setDate(today)} todayLabel="This month"
      />
      <section className="card">
        <div className="cal">
          {DAYS.map((d) => <div key={d} className="cal-h">{d}</div>)}
          {Array.from({ length: dayIdx(first) }, (_, i) => <div key={`b${i}`} />)}
          {dates.map((d) => {
            const st = dayStats(p.state, d);
            const tracked = isTracked(p.state, d, today) && st.score != null;
            const band = tracked ? bandFor(st.score) : null;
            return (
              <button
                key={fmt(d)} onClick={() => goDay(d)}
                className={`cal-d ${fmt(d) === fmt(today) ? 'is-today' : ''} ${d > today ? 'future' : ''}`}
                style={band ? { background: band.bg, borderColor: band.color } : undefined}
                aria-label={`${longDate(d)}${tracked ? `, score ${st.score}` : ''}`}
              >
                <span>{d.getDate()}</span>
                {tracked && <b>{st.score}</b>}
                {tracked && st.score >= 90 && <i>✨</i>}
              </button>
            );
          })}
        </div>
        <div className="legend">
          {[...BANDS].reverse().map((b) => (
            <span key={b.id}><i style={{ background: b.bg, borderColor: b.color }} />{b.name} {b.min}+</span>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Week by week</h3>
        {weeks.map((k) => {
          const ws = new Date(k + 'T00:00:00');
          const w = review(p.state, weekDates(ws).filter((d) => d.getMonth() === first.getMonth()), today);
          return (
            <div key={k} className="wbar">
              <span>{shortDate(ws)}</span>
              <div><i style={{ width: `${w.score ?? 0}%`, background: w.band ? w.band.color : 'transparent' }} /></div>
              <b>{w.score == null ? '–' : `${w.score}%`}</b>
            </div>
          );
        })}
      </section>
      <Review rv={rv} scope="this month" prevScore={prev} streakDays={streak(p.state, today)}
        emptyText="Your monthly review grows as you complete days. Keep shining! 🌞" />
    </>
  );
}

/* ------------------------------ TEMPLATES ------------------------------ */
export function TemplateCard({ tpl, active, onUse, label = 'Use for this week' }) {
  const preview = [...tpl.tasks].sort((a, b) => a.time.localeCompare(b.time)).slice(0, 5);
  return (
    <article className={`card tpl ${active ? 'active' : ''}`}>
      <div className="tpl-emoji">{tpl.emoji}</div>
      <h3>{tpl.name}</h3>
      <p className="src">{tpl.source}</p>
      <p>{tpl.blurb}</p>
      {preview.length > 0 && (
        <ul>{preview.map((t, i) => <li key={i}><span style={{ color: CATS[t.cat].color }}>●</span> {t.title}</li>)}</ul>
      )}
      <button className="btn primary" onClick={() => onUse(tpl)}>{active ? '✓ Current routine' : label}</button>
    </article>
  );
}

export function TemplatesView({ p, onUse }) {
  return (
    <>
      <div className="date-nav"><div className="date-title"><h2>Routine templates</h2>
        <p>Pick a proven starting point, then tweak every task to fit your life. Changes carry into the weeks you haven't opened yet.</p></div></div>
      <div className="tpl-grid">
        {TEMPLATES.map((t) => <TemplateCard key={t.id} tpl={t} active={p.state.templateId === t.id} onUse={onUse} />)}
      </div>
    </>
  );
}

/* ------------------------------ GUIDE ------------------------------ */
export function GuideView() {
  return (
    <>
      <div className="date-nav"><div className="date-title"><h2>How your sunshine score works</h2>
        <p>Every task has a weight: ★ nice-to-do, ★★ important, ★★★ must-do. Score = points you completed ÷ points you planned × 100.</p></div></div>
      <div className="guide">
        {BANDS.map((b) => (
          <section key={b.id} className="card guide-card" style={{ '--band': b.color, '--bandbg': b.bg }}>
            <div className="band-head">
              <span className="band-emoji">{b.emoji}</span>
              <div>
                <h3>{b.name} <span className="band-score">{b.min === 90 ? '90–100' : `${b.min}–${BANDS[BANDS.indexOf(b) - 1].min - 1}`}</span></h3>
                <p><b>{b.headline}</b> {b.summary}</p>
              </div>
            </div>
            <ul className="advice">{b.tips.map((t) => <li key={t}>{t}</li>)}</ul>
          </section>
        ))}
        <section className="card">
          <h3>🔍 Strong &amp; weak points</h3>
          <p>A life area (Body, Mind, Focus, Health, Growth, Joy) is a <b>strong point</b> at 75%+ and a <b>weak point</b> below 60%. Discipline is the share of days that scored 60+, and your streak counts consecutive days at 60+.</p>
        </section>
      </div>
    </>
  );
}
