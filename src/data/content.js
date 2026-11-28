// All the "content" of the app lives here: categories, routine templates,
// score bands (with pre-made suggestions) and positive quotes.
// Edit freely - the UI reads everything from this file.

export const CATS = {
  body:   { label: 'Body',         icon: '💪', color: '#FF8A5B' },
  mind:   { label: 'Mind',         icon: '🧘', color: '#8E7CF0' },
  work:   { label: 'Focus & Work', icon: '🎯', color: '#F5A524' },
  health: { label: 'Health',       icon: '🥗', color: '#3DBE8B' },
  growth: { label: 'Growth',       icon: '📚', color: '#3AA0F0' },
  joy:    { label: 'Joy & People', icon: '💛', color: '#F06292' },
};

export const WEIGHTS = { 1: 'Nice-to-do', 2: 'Important', 3: 'Must-do' };

const ALL = [0, 1, 2, 3, 4, 5, 6]; // Mon=0 ... Sun=6
const WK = [0, 1, 2, 3, 4];
const WE = [5, 6];
const t = (time, title, cat, w, days = ALL) => ({ time, title, cat, w, days });

// Routines adapted from widely used frameworks: Miracle Morning (S.A.V.E.R.S.),
// Pomodoro + active recall, time-blocking / "eat the frog", and the
// movement-sleep-nutrition basics of lifestyle medicine.
export const TEMPLATES = [
  {
    id: 'sunrise', emoji: '🌅', name: 'Sunrise Starter',
    source: 'Inspired by the Miracle Morning "S.A.V.E.R.S." habit stack',
    blurb: 'Win the morning, win the day. Silence, affirmations, movement, reading and planning before the world wakes up.',
    tasks: [
      t('06:00', 'Wake up & drink a glass of water', 'health', 1),
      t('06:10', 'Silence: 10 min meditation or deep breathing', 'mind', 2),
      t('06:25', 'Write 3 gratitudes & affirmations', 'mind', 1),
      t('06:35', 'Move your body: 20 min exercise', 'body', 3),
      t('07:00', 'Read 10 pages of something inspiring', 'growth', 2),
      t('07:15', 'Plan the day: pick your Top 3', 'work', 2),
      t('09:00', 'Deep-work block #1 (90 min, phone away)', 'work', 3, WK),
      t('12:30', 'Healthy lunch + 10 min sunshine walk', 'health', 2),
      t('15:00', 'Deep-work block #2 (60 min)', 'work', 2, WK),
      t('18:30', 'Connect with someone you care about', 'joy', 2),
      t('21:30', 'Digital sunset: screens off', 'mind', 2),
      t('22:30', 'Lights out: 7-8 hours of sleep', 'health', 3),
      t('10:00', 'Weekend passion project / hobby time', 'joy', 2, WE),
      t('11:30', 'Weekly review & plan next week', 'work', 3, [6]),
    ],
  },
  {
    id: 'student', emoji: '📖', name: 'Student Focus',
    source: 'Pomodoro technique + spaced repetition & active recall',
    blurb: 'Focused study sprints, daily revision, movement and enough sleep, with a weekly mock-test and a joyful rest day.',
    tasks: [
      t('06:30', 'Wake up, water, make the bed', 'health', 1),
      t('06:45', 'Stretch or 15 min walk', 'body', 2),
      t('07:30', 'Pomodoro set 1: hardest subject (2 x 25 min)', 'work', 3, WK),
      t('10:00', 'Pomodoro set 2: new topic (2 x 25 min)', 'work', 3, WK),
      t('14:00', 'Practice problems / assignments', 'work', 2, WK),
      t('16:30', 'Active recall: 20 flashcards or a 1-page summary', 'growth', 2),
      t('17:30', 'Sport, gym or play', 'body', 2),
      t('19:30', 'Skill or side project (45 min)', 'growth', 2),
      t('20:30', "Pack tomorrow's bag & list", 'work', 1),
      t('21:00', 'Chat with family or friends', 'joy', 1),
      t('22:30', 'Sleep: 7+ hours', 'health', 3),
      t('10:00', 'Weekly revision + mock test', 'work', 3, [5]),
      t('11:00', 'Family and fun day: recharge fully', 'joy', 2, [6]),
    ],
  },
  {
    id: 'pro', emoji: '💼', name: 'Professional Balance',
    source: 'Time-blocking, "eat the frog" and a shutdown ritual',
    blurb: 'Do the hardest thing first, batch the small stuff, finish work on time and protect your evenings.',
    tasks: [
      t('07:00', 'Wake up, hydrate, 5 min sunlight', 'health', 1),
      t('07:30', 'Workout or brisk 30 min walk', 'body', 3, [0, 2, 4]),
      t('08:30', 'Review calendar & choose your "frog" (#1 priority)', 'work', 2, WK),
      t('09:00', 'Eat the frog: 90 min deep work', 'work', 3, WK),
      t('11:30', 'Inbox & messages batch (30 min)', 'work', 1, WK),
      t('13:00', 'Lunch away from the desk', 'health', 2, WK),
      t('15:00', 'Learn something: 30 min', 'growth', 2, WK),
      t('17:30', 'Shutdown ritual: log wins, plan tomorrow', 'work', 2, WK),
      t('19:00', 'Quality time with family or friends (no phone)', 'joy', 3),
      t('21:00', 'Wind down: read or stretch', 'mind', 2),
      t('22:45', 'Sleep on time', 'health', 3),
      t('09:00', 'Nature outing or hobby', 'joy', 2, WE),
      t('19:30', 'Plan the week ahead', 'work', 2, [6]),
    ],
  },
  {
    id: 'wellness', emoji: '🌿', name: 'Wellness & Fitness',
    source: 'Lifestyle-medicine basics: move, eat well, sleep, breathe',
    blurb: 'Strength and cardio days, active recovery, balanced meals, hydration and a calm evening.',
    tasks: [
      t('06:30', 'Wake up + 500 ml water', 'health', 1),
      t('06:45', 'Mobility & stretching (10 min)', 'body', 1),
      t('07:00', 'Workout: strength or cardio', 'body', 3, [0, 2, 4, 5]),
      t('07:00', 'Walk or yoga (active recovery)', 'body', 2, [1, 3, 6]),
      t('08:00', 'Protein-rich breakfast', 'health', 2),
      t('12:00', 'Half of your water goal done', 'health', 1),
      t('13:00', 'Balanced lunch, eaten mindfully', 'health', 2),
      t('16:00', '10 min walking break', 'body', 1),
      t('18:30', 'Home-cooked dinner', 'health', 2),
      t('20:30', 'Breathing or meditation (10 min)', 'mind', 2),
      t('21:00', 'Gratitude journal', 'mind', 1),
      t('22:15', 'Sleep: lights out', 'health', 3),
      t('10:00', 'Fun activity: sport, dance or hike', 'joy', 2, [5]),
      t('17:00', 'Meal prep for the week', 'health', 2, [6]),
    ],
  },
  {
    id: 'creator', emoji: '🎨', name: 'Creator & Side Project',
    source: 'Daily creative practice: make, learn, share, reflect',
    blurb: 'Protect a daily creation block, keep learning, ship small things often and reflect before bed.',
    tasks: [
      t('06:00', 'Wake up & move (15 min)', 'body', 2),
      t('06:45', 'Morning pages / idea dump (10 min)', 'growth', 2),
      t('07:30', 'Create: 90 min on your project', 'work', 3),
      t('12:30', 'Lunch + walk', 'health', 2),
      t('14:00', 'Learn: 30 min course or reading', 'growth', 2),
      t('17:00', 'Share or ship something small', 'work', 2),
      t('18:30', 'Exercise', 'body', 2),
      t('20:00', 'Inspiration time: watch, read or play', 'joy', 2),
      t('21:30', 'Reflect: one thing I learned today', 'mind', 1),
      t('22:30', 'Sleep', 'health', 3),
      t('10:00', 'Long creative session (2 h)', 'work', 3, [5]),
      t('18:00', 'Weekly review: what shipped?', 'work', 2, [6]),
    ],
  },
  {
    id: 'blank', emoji: '🗒️', name: 'Blank Canvas',
    source: 'Start from nothing',
    blurb: 'An empty week. Add only the tasks you truly want to commit to.',
    tasks: [],
  },
];

// Score ranges. Each band carries its own pre-made suggestions.
export const BANDS = [
  {
    min: 90, id: 'radiant', name: 'Radiant', emoji: '🌞', color: '#FFB627', bg: '#FFE7A8',
    headline: 'You are shining bright!',
    summary: 'Outstanding discipline: your routine is running like clockwork.',
    tips: [
      'Keep this rhythm, but protect your rest. Schedule one real recovery block so you never burn out.',
      'Raise the bar gently: add ONE stretch goal to your weakest area, not five.',
      'Share your routine with a friend. Teaching it locks it in (and brightens their day too).',
    ],
  },
  {
    min: 75, id: 'glowing', name: 'Glowing', emoji: '🌤️', color: '#F5C542', bg: '#FFEFB8',
    headline: 'Beautiful consistency!',
    summary: 'You are only a few tasks away from radiant.',
    tips: [
      'Look at the 1-2 tasks you skip most. Shrink them (5 minutes counts!) or move them to a better time.',
      'Use the "never miss twice" rule: one skip is fine, the next day you show up.',
      'Reward every 75+ day: tea in the sun, a favourite song, a walk outside.',
    ],
  },
  {
    min: 60, id: 'steady', name: 'Steady Sunrise', emoji: '⛅', color: '#E7B94A', bg: '#FFF3CF',
    headline: 'A solid base is forming.',
    summary: 'The habit is taking root. Consistency is your next level.',
    tips: [
      'Mark your top 3 tasks as "Must-do" and do them first, before anything else.',
      'Trim your plan. Too many tasks cause burnout, so remove 1-2 you never complete.',
      'Stack habits: attach a new one right after one you already do (after tea, read 10 pages).',
    ],
  },
  {
    min: 40, id: 'warming', name: 'Warming Up', emoji: '🌥️', color: '#6DB8DC', bg: '#D8EEF9',
    headline: 'You are making progress!',
    summary: 'Every tick counts. Let us make it easier to show up.',
    tips: [
      'Start tiny: do the 2-minute version of each habit. Momentum beats perfection.',
      'Fix your wake-up and sleep time first. Every other habit gets easier.',
      "Plan tomorrow tonight: lay out clothes, notes and a water bottle.",
      'Cut the plan to 5 key tasks this week and add more once you reach 70.',
    ],
  },
  {
    min: 0, id: 'dawn', name: 'Fresh Dawn', emoji: '🌅', color: '#E58FB5', bg: '#FADCE9',
    headline: 'Every sunrise is a new start.',
    summary: 'A low score is information, not a verdict. Today is a clean page.',
    tips: [
      'Be kind to yourself. Choose just ONE keystone habit (water, a walk or bedtime) and win it for 3 days.',
      'Lower the plan: pick the lightest template or keep only 3 tasks this week.',
      'Ask a friend to be your check-in buddy. A single message a day works wonders.',
    ],
  },
];

// Pre-made strong/weak commentary per category.
export const CAT_TIPS = {
  body:   { strong: 'Your body habits are glowing. Movement is your superpower.',
            weak: ['Shrink the workout: 10 minutes of stretching or a walk still counts.', 'Exercise at the same time daily and lay out your gear the night before.'] },
  mind:   { strong: 'Calm and reflective. Your mindfulness habit is strong.',
            weak: ['Try 2 minutes of slow breathing right after waking.', 'Go screen-free for the last 30 minutes before bed.'] },
  work:   { strong: 'Focus is a strength. You protect your deep-work time.',
            weak: ['Use 25-minute focus sprints with your phone in another room.', 'Pick your Top 3 the night before so mornings start with clarity.'] },
  health: { strong: 'Sleep, food and water are on point. This is the base of everything.',
            weak: ['Fix your sleep time first, since it lifts every other habit.', 'Keep a water bottle visible and prep one healthy meal ahead.'] },
  growth: { strong: 'You are learning daily, and small steps are compounding nicely.',
            weak: ['Commit to 10 pages or 15 minutes, anchored to something you already do daily.', 'Keep your book or course open in an easy-to-reach spot.'] },
  joy:    { strong: 'You are nourishing joy and relationships. That fuels everything else.',
            weak: ['Send one kind message to someone each day.', 'Schedule fun like an appointment. Rest is productive too.'] },
};

export const QUOTES = [
  'Small steps, taken daily, build a bright life.',
  'Today is a fresh page. Write something you are proud of.',
  'You do not have to be perfect, just consistent and kind to yourself.',
  'Sunshine follows the ones who keep showing up.',
  'Progress, not perfection.',
  'Every tick is a tiny victory. Celebrate it!',
  'Your future self is smiling at what you do today.',
  'Discipline is just self-love in action.',
  'Start where you are. Use what you have. Do what you can.',
  'A good day starts with a good plan and a good attitude.',
  'Bloom where you are planted.',
  'Be the reason your own day feels brighter.',
];
