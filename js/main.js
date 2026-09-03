/* 
  ZDAGA FITNESS CLUB - Modern Fight Gym Engine
*/
.
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFightBell();
  initSchedule();
});

/* Mobile Navigation Toggle */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('mobile-active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('mobile-active');
    });
  });
}

/* Simple Audio Fight Bell Synthesizer */
function initFightBell() {
  const bellBtns = document.querySelectorAll('.bell-trigger');
  bellBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playBrassBell();
    });
  });
}

function playBrassBell() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const freqs = [880, 1760];
    const now = ctx.currentTime;

    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.8);
    });
  } catch (e) {
    console.log(e);
  }
}

/* Schedule Data & Filter */
const SCHEDULE_DATA = [
  { day: 'mon', time: '06:00 AM – 07:30 AM', discipline: 'boxing', title: 'Morning Heavy Bag & Footwork', level: 'All Levels', coach: 'Coach Zdagi' },
  { day: 'mon', time: '04:30 PM – 06:00 PM', discipline: 'taekwondo', title: 'Taekwondo WT Kicking & Forms', level: 'Beginner to Intermediate', coach: 'Coach Tadesse' },
  { day: 'mon', time: '06:00 PM – 07:30 PM', discipline: 'boxing', title: 'Boxing Mitt Work & Sparring', level: 'Intermediate / Fight Team', coach: 'Coach Zdagi' },

  { day: 'tue', time: '06:00 AM – 07:30 AM', discipline: 'fitness', title: 'Fight Conditioning & Battle Ropes', level: 'All Levels', coach: 'Coach Alex' },
  { day: 'tue', time: '04:30 PM – 06:00 PM', discipline: 'boxing', title: 'Boxing Defense & Ring Craft', level: 'All Levels', coach: 'Coach Zdagi' },
  { day: 'tue', time: '06:00 PM – 07:30 PM', discipline: 'taekwondo', title: 'Taekwondo Sparring (Gyeorugi)', level: 'All Levels', coach: 'Coach Tadesse' },

  { day: 'wed', time: '06:00 AM – 07:30 AM', discipline: 'boxing', title: 'Morning Heavy Bag & Stamina', level: 'All Levels', coach: 'Coach Zdagi' },
  { day: 'wed', time: '04:30 PM – 06:00 PM', discipline: 'fitness', title: 'Core Explosion & High Intensity', level: 'All Levels', coach: 'Coach Alex' },
  { day: 'wed', time: '06:00 PM – 07:30 PM', discipline: 'boxing', title: 'Counter Punching & Body Work', level: 'Advanced', coach: 'Coach Zdagi' },

  { day: 'thu', time: '06:00 AM – 07:30 AM', discipline: 'taekwondo', title: 'Morning Flexibility & Speed Kicks', level: 'All Levels', coach: 'Coach Tadesse' },
  { day: 'thu', time: '04:30 PM – 06:00 PM', discipline: 'boxing', title: 'Boxing Speed Mitts & Combinations', level: 'All Levels', coach: 'Coach Zdagi' },
  { day: 'thu', time: '06:00 PM – 07:30 PM', discipline: 'fitness', title: 'Full Body Endurance Circuit', level: 'All Levels', coach: 'Coach Alex' },

  { day: 'fri', time: '06:00 AM – 07:30 AM', discipline: 'boxing', title: 'Morning Sparring & Strategy', level: 'Fight Team', coach: 'Coach Zdagi' },
  { day: 'fri', time: '04:30 PM – 06:00 PM', discipline: 'taekwondo', title: 'Poomsae Precision & Self Defense', level: 'All Levels', coach: 'Coach Tadesse' },
  { day: 'fri', time: '06:00 PM – 07:30 PM', discipline: 'boxing', title: 'Friday Fight Night Open Sparring', level: 'All Levels', coach: 'Coach Zdagi' },

  { day: 'sat', time: '07:00 AM – 09:00 AM', discipline: 'fitness', title: 'Weekend Heavy Boot Camp', level: 'All Levels', coach: 'All Coaches' },
  { day: 'sat', time: '03:00 PM – 05:00 PM', discipline: 'boxing', title: 'Youth & Beginner Technique Clinic', level: 'Beginners / Youth', coach: 'Coach Zdagi' }
];

let activeDay = 'mon';
let activeDiscipline = 'all';

function initSchedule() {
  const dayTabs = document.querySelectorAll('.tab-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');

  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dayTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeDay = tab.dataset.day;
      renderSchedule();
    });
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDiscipline = btn.dataset.discipline;
      renderSchedule();
    });
  });

  renderSchedule();
}

function renderSchedule() {
  const tbody = document.getElementById('scheduleTableBody');
  if (!tbody) return;

  const filtered = SCHEDULE_DATA.filter(item => {
    const matchDay = item.day === activeDay;
    const matchDisc = activeDiscipline === 'all' || item.discipline === activeDiscipline;
    return matchDay && matchDisc;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 24px; color: var(--text-dim);">No sessions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => `
    <tr>
      <td style="font-weight: 700; color: var(--accent-gold);">${item.time}</td>
      <td><strong>${item.title}</strong></td>
      <td><span style="background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; font-size: 0.82rem;">${item.level}</span></td>
      <td><span style="color: var(--accent-red); font-weight: 600;">${item.coach}</span></td>
    </tr>
  `).join('');
}
