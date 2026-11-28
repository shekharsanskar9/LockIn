import { useEffect, useRef, useState } from 'react';
import { CATS, TEMPLATES, WEIGHTS } from '../data/content.js';
import { DAYS } from '../lib/dates.js';
import { TemplateCard } from './Views.jsx';

export function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h3>{title}</h3>
          {onClose && <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>}
        </div>
        {children}
      </div>
    </div>
  );
}

export function TaskModal({ task, defaultDays, onSave, onDelete, onClose }) {
  const [f, setF] = useState(task || { title: '', time: '09:00', cat: 'work', w: 2, days: defaultDays });
  const ref = useRef(null);
  useEffect(() => ref.current?.focus(), []);
  const toggleDay = (i) => setF((x) => ({
    ...x, days: x.days.includes(i) ? x.days.filter((d) => d !== i) : [...x.days, i].sort(),
  }));
  const valid = f.title.trim() && f.days.length;
  return (
    <Modal title={task ? 'Edit task' : 'Add a task'} onClose={onClose}>
      <form className="form" onSubmit={(e) => { e.preventDefault(); if (valid) onSave({ ...f, title: f.title.trim(), w: +f.w }); }}>
        <label>What will you do?
          <input ref={ref} value={f.title} maxLength={80} placeholder="e.g. 20 min walk in the sun"
            onChange={(e) => setF({ ...f, title: e.target.value })} />
        </label>
        <div className="row">
          <label>Time <input type="time" value={f.time} required onChange={(e) => setF({ ...f, time: e.target.value })} /></label>
          <label>Area
            <select value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>
              {Object.entries(CATS).map(([k, c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
            </select>
          </label>
          <label>Priority
            <select value={f.w} onChange={(e) => setF({ ...f, w: e.target.value })}>
              {Object.entries(WEIGHTS).map(([k, v]) => <option key={k} value={k}>{'★'.repeat(k)} {v}</option>)}
            </select>
          </label>
        </div>
        <fieldset>
          <legend>Repeat on (this week)</legend>
          <div className="chips">
            {DAYS.map((d, i) => (
              <button type="button" key={d} className={`dchip ${f.days.includes(i) ? 'on' : ''}`}
                aria-pressed={f.days.includes(i)} onClick={() => toggleDay(i)}>{d}</button>
            ))}
          </div>
        </fieldset>
        <p className="muted small">Changes apply to this week and to future weeks you haven't opened yet.</p>
        <div className="actions">
          {task && <button type="button" className="btn danger" onClick={() => onDelete(task)}>Delete</button>}
          <span className="grow" />
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!valid}>Save</button>
        </div>
      </form>
    </Modal>
  );
}

export function ConfirmModal({ title, text, yes = 'Yes, continue', onYes, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p>{text}</p>
      <div className="actions"><span className="grow" />
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={onYes}>{yes}</button>
      </div>
    </Modal>
  );
}

export function SettingsModal({ name, onName, onExport, onImport, onReset, onClose }) {
  const [n, setN] = useState(name);
  const file = useRef(null);
  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="form">
        <label>Your name
          <input value={n} maxLength={30} placeholder="sunshine" onChange={(e) => setN(e.target.value)} onBlur={() => onName(n.trim())} />
        </label>
        <div className="row">
          <button className="btn soft" onClick={onExport}>⬇ Export backup</button>
          <button className="btn soft" onClick={() => file.current.click()}>⬆ Import backup</button>
          <input ref={file} type="file" accept="application/json" hidden
            onChange={(e) => { const f = e.target.files[0]; if (f) f.text().then(onImport); e.target.value = ''; }} />
        </div>
        <p className="muted small">Everything is stored in this browser. Export a backup to keep it safe or move devices.</p>
        <div className="actions">
          <button className="btn danger" onClick={onReset}>Reset everything</button>
          <span className="grow" />
          <button className="btn primary" onClick={() => { onName(n.trim()); onClose(); }}>Done</button>
        </div>
      </div>
    </Modal>
  );
}

export function Onboarding({ onPick, onSkip }) {
  return (
    <Modal title="Welcome to LockIn ☀️" wide>
      <p>Pick a proven routine to start with. You can edit every task and change it again each week.</p>
      <div className="tpl-grid compact">
        {TEMPLATES.map((t) => <TemplateCard key={t.id} tpl={t} onUse={onPick} label="Start with this" />)}
      </div>
      <div className="actions"><span className="grow" /><button className="btn ghost" onClick={onSkip}>Skip for now</button></div>
    </Modal>
  );
}
