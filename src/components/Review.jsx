import { CATS, CAT_TIPS } from '../data/content.js';
import { disciplineLabel } from '../lib/scoring.js';
import { DAYS, dayIdx, shortDate } from '../lib/dates.js';

const todName = { morning: 'Mornings', afternoon: 'Afternoons', evening: 'Evenings' };

// Score, discipline, strong points, weak points and advice for a day/week/month.
export default function Review({ rv, scope, prevScore, streakDays, emptyText }) {
  if (rv.score == null) {
    return (
      <section className="card review">
        <h3>🌻 Your sunshine review</h3>
        <p className="muted">{emptyText || `Tick off a task and your ${scope} review will appear here.`}</p>
      </section>
    );
  }
  const { band } = rv;
  const delta = prevScore != null ? rv.score - prevScore : null;

  const strongItems = [
    ...rv.strong.slice(0, 3).map((s) => ({
      k: s.cat, icon: CATS[s.cat].icon,
      title: `${CATS[s.cat].label} · ${s.pct}%`, text: CAT_TIPS[s.cat].strong,
    })),
  ];
  if (rv.bestDay) strongItems.push({ k: 'best', icon: '🏆', title: `Best day · ${rv.bestDay.score}%`, text: `${DAYS[dayIdx(rv.bestDay.date)]} ${shortDate(rv.bestDay.date)} was your shining moment.` });
  if (rv.rhythm && rv.rhythm.best[1] >= 70) strongItems.push({ k: 'rhythm', icon: '⏰', title: `${todName[rv.rhythm.best[0]]} · ${rv.rhythm.best[1]}%`, text: `${todName[rv.rhythm.best[0]]} are your power time.` });
  if (rv.consistency >= 70) strongItems.push({ k: 'cons', icon: '🔥', title: `Consistency · ${rv.consistency}%`, text: `${rv.consistency}% of your days scored 60+.` });

  const weakItems = rv.weak.slice(0, 3).map((w) => ({
    k: w.cat, icon: CATS[w.cat].icon,
    title: `${CATS[w.cat].label} · ${w.pct}%`, text: `Needs love. ${CAT_TIPS[w.cat].weak[0]}`,
  }));
  rv.mostMissed.forEach((m) => weakItems.push({
    k: `m-${m.title}`, icon: '⏭️', title: 'Often skipped',
    text: scope === 'today' ? `"${m.title}" is still waiting for you.` : `"${m.title}" · missed ${m.miss} of ${m.tot} times.`,
  }));
  if (rv.rhythm && rv.rhythm.worst[1] < 60) weakItems.push({ k: 'rw', icon: '🌙', title: `${todName[rv.rhythm.worst[0]]} · ${rv.rhythm.worst[1]}%`, text: `${todName[rv.rhythm.worst[0]]} slip away. Try a lighter plan then.` });
  if (rv.toughDay) weakItems.push({ k: 'tough', icon: '🌧️', title: `Toughest day · ${rv.toughDay.score}%`, text: `${DAYS[dayIdx(rv.toughDay.date)]} ${shortDate(rv.toughDay.date)}: plan it lighter next time.` });

  return (
    <section className="card review" style={{ '--band': band.color, '--bandbg': band.bg }}>
      <div className="band-head">
        <span className="band-emoji" aria-hidden="true">{band.emoji}</span>
        <div>
          <h3>{band.name} <span className="band-score">{rv.score}/100</span></h3>
          <p><b>{band.headline}</b> {band.summary}</p>
        </div>
      </div>

      <div className="stats">
        <div><b>{rv.consistency}%</b><span>Discipline · {disciplineLabel(rv.consistency)}</span></div>
        <div><b>{streakDays}🔥</b><span>Day streak (60+)</span></div>
        <div><b>{rv.tasksDone}/{rv.tasksTotal}</b><span>Tasks done</span></div>
        {delta != null && (
          <div><b className={delta >= 0 ? 'up' : 'down'}>{delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}</b><span>vs previous</span></div>
        )}
      </div>

      <div className="cols">
        <div className="pts good">
          <h4>💪 Strong points</h4>
          {strongItems.length ? (
            <ul>{strongItems.map((i) => (
              <li key={i.k}><span>{i.icon}</span><div><b>{i.title}</b><p>{i.text}</p></div></li>
            ))}</ul>
          ) : (
            <p className="muted">Showing up and planning is already a win. Strong points appear once an area passes 75%. 🌱</p>
          )}
        </div>
        <div className="pts work">
          <h4>🌱 Room to grow</h4>
          {weakItems.length ? (
            <ul>{weakItems.map((i) => (
              <li key={i.k}><span>{i.icon}</span><div><b>{i.title}</b><p>{i.text}</p></div></li>
            ))}</ul>
          ) : (
            <p className="muted">Nothing under 60%. Wonderful! Keep your rhythm. ✨</p>
          )}
        </div>
      </div>

      <h4 className="adv-h">✨ Your advice for the {scope === 'today' ? 'day' : scope.replace('this ', '')}</h4>
      <ul className="advice">
        {rv.tips.band.map((t) => <li key={t}>{t}</li>)}
        {rv.tips.cats.map((c) => <li key={c.cat}><b>{CATS[c.cat].icon} {CATS[c.cat].label}:</b> {c.text}</li>)}
      </ul>

      <div className="cat-bars">
        {rv.catList.map((c) => (
          <div key={c.cat} className="cbar" title={`${CATS[c.cat].label}: ${c.pct}%`}>
            <span>{CATS[c.cat].icon} {CATS[c.cat].label}</span>
            <div><i style={{ width: `${c.pct}%`, background: CATS[c.cat].color }} /></div>
            <em>{c.pct}%</em>
          </div>
        ))}
      </div>
    </section>
  );
}
