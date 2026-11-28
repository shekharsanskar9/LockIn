// Date helpers. Weeks start on Monday (index 0). All dates are local.
const pad = (n) => String(n).padStart(2, '0');

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const dayIdx = (d) => (d.getDay() + 6) % 7;
export const weekStart = (d) => addDays(d, -dayIdx(d));
export const wkKey = (d) => fmt(weekStart(d));
export const todayDate = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
export const weekDates = (d) => Array.from({ length: 7 }, (_, i) => addDays(weekStart(d), i));
export const monthDates = (d) => {
  const n = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return Array.from({ length: n }, (_, i) => new Date(d.getFullYear(), d.getMonth(), i + 1));
};
export const seedOf = (d) => Math.floor(d.getTime() / 864e5);
export const uid = () => Math.random().toString(36).slice(2, 9);

export const fmtTime = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`;
};
export const longDate = (d) => d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
export const shortDate = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
export const monthName = (d) => d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
