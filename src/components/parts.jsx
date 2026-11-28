import { CATS } from '../data/content.js';
import { fmtTime } from '../lib/dates.js';

export function Ring({ score, size = 170 }) {
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  const p = score == null ? 0 : score;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD54F" />
            <stop offset="1" stopColor="#FF9F1C" />
          </linearGradient>
        </defs>
        <circle className="ring-bg" cx={size / 2} cy={size / 2} r={r} />
        <circle
          className="ring-fg" cx={size / 2} cy={size / 2} r={r}
          stroke="url(#ringg)" strokeDasharray={c} strokeDashoffset={c * (1 - p / 100)}
          style={{ '--full': c }} transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-in">
        <b>{score == null ? '–' : score}</b>
        <small>/ 100</small>
      </div>
    </div>
  );
}

export function TaskRow({ task, dateStr, done, locked, compact, onToggle, onEdit }) {
  const cat = CATS[task.cat];
  return (
    <div className={`task ${done ? 'done' : ''} ${compact ? 'compact' : ''}`} style={{ '--c': cat.color }}>
      <button
        className="check" aria-pressed={done} aria-label={`${done ? 'Untick' : 'Tick'} ${task.title}`}
        data-locked={locked ? '1' : undefined} onClick={() => onToggle(dateStr, task.id)}
      >
        {done ? '✓' : ''}
      </button>
      <div className="t-main">
        <span className="t-time">{fmtTime(task.time)}</span>
        <span className="t-title">{task.title}</span>
        {!compact && (
          <span className="t-meta">
            <span className="chip" style={{ '--c': cat.color }}>{cat.icon} {cat.label}</span>
            <span className="stars" title={`Weight ${task.w}`}>{'★'.repeat(task.w)}</span>
          </span>
        )}
      </div>
      <button className="icon-btn" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task, dateStr)}>✎</button>
    </div>
  );
}

export function Empty({ children }) {
  return <div className="empty">{children}</div>;
}
