// Leonida Legend: an offline trophy guide and tracker for GTA VI on PS5.
// Progress (earned trophies and counter values) lives in localStorage on this
// device only. Nothing here talks to the network.
const KEY = 'leonida-legend-progress-v1';
const listEl = document.getElementById('trophyList');
const emptyNote = document.getElementById('emptyNote');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const statusEl = document.getElementById('status');
const spoilersEl = document.getElementById('spoilers');
const hideEarnedEl = document.getElementById('hideEarned');
const countLine = document.getElementById('countLine');
const stageChips = [...document.querySelectorAll('.stage-chip')];

let stageFilter = 'all';
let doc = null;
let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { earned: [], counters: {}, spoilers: false, hideEarned: false };
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned : [],
      counters: parsed.counters && typeof parsed.counters === 'object' ? parsed.counters : {},
      spoilers: Boolean(parsed.spoilers),
      hideEarned: Boolean(parsed.hideEarned),
    };
  } catch {
    return { earned: [], counters: {}, spoilers: false, hideEarned: false };
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function isEarned(t) {
  return state.earned.includes(t.id);
}

function counterValue(t) {
  return Math.max(0, Math.min(t.target ?? 0, Number(state.counters[t.id] ?? 0) || 0));
}

function syncCounterEarned(t) {
  if (t.target == null) return;
  const done = counterValue(t) >= t.target;
  const has = state.earned.includes(t.id);
  if (done && !has) state.earned.push(t.id);
  if (!done && has) state.earned = state.earned.filter((id) => id !== t.id);
}

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function kindLabel(kind) {
  const labels = {
    story: 'Story', side: 'Side mission', activity: 'Activity', collectible: 'Collectible',
    crime: 'Crime', combat: 'Combat', money: 'Money', misc: 'Miscellaneous', completion: 'Completion',
  };
  return labels[kind] ?? kind;
}

function stageLabel(stage) {
  return 'Stage ' + stage;
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function render() {
  const query = searchEl.value.trim().toLowerCase();
  const earnedSet = new Set(state.earned);
  listEl.replaceChildren();
  let shown = 0;
  let earnedShown = 0;

  for (const t of doc.trophies) {
    const earned = earnedSet.has(t.id);
    if (kindEl.value !== 'all' && t.kind !== kindEl.value) continue;
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) continue;
    if (stageFilter !== 'all' && String(t.stage) !== stageFilter) continue;
    if (statusEl.value === 'earned' && !earned) continue;
    if (statusEl.value === 'missing' && earned) continue;
    if (statusEl.value === 'missable' && !t.missable) continue;
    if (hideEarnedEl.checked && earned) continue;
    if (query) {
      const hay = `${t.name} ${t.description} ${t.guide} ${kindLabel(t.kind)} ${stageLabel(t.stage)}`.toLowerCase();
      if (!hay.includes(query)) continue;
    }

    const li = el('li', `trophy grade-${t.grade}${earned ? ' earned' : ''}`);
    const head = el('div', 'trophy-head');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned;
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) {
        if (!state.earned.includes(t.id)) state.earned.push(t.id);
        if (t.target != null) state.counters[t.id] = t.target;
      } else {
        state.earned = state.earned.filter((id) => id !== t.id);
        if (t.target != null) state.counters[t.id] = 0;
      }
      save();
      render();
    });
    head.append(box);

    const titleBox = el('div', 'trophy-title');
    const h3 = el('h3');
    h3.append(el('span', 't-num', `#${t.id}`));
    h3.append(document.createTextNode(t.name));
    titleBox.append(h3);

    const spoilerOn = spoilersEl.checked && t.kind === 'story' && !earned;
    if (spoilerOn) {
      titleBox.append(el('p', 'trophy-desc', 'Story trophy — hidden until earned (spoiler-safe mode is on).'));
    } else {
      titleBox.append(el('p', 'trophy-desc', t.description));
    }
    const tags = el('div', 'tags');
    tags.append(el('span', `tag grade-${t.grade}`, gradeLabel(t.grade)));
    tags.append(el('span', 'tag', kindLabel(t.kind)));
    tags.append(el('span', 'tag', stageLabel(t.stage)));
    if (t.missable) tags.append(el('span', 'tag missable', 'Missable'));
    if (earned) tags.append(el('span', 'tag earned-tag', 'Earned'));
    titleBox.append(tags);
    head.append(titleBox);
    li.append(head);

    if (spoilerOn) {
      li.append(el('p', 'spoiler-box', 'This story trophy is hidden to avoid spoilers. Earn it in-game (or untick spoiler-safe mode) to see its guide.'));
    } else {
      const guide = el('div', 'guide');
      guide.append(el('p', null, t.guide));
      li.append(guide);
      if (t.missable && t.missable_reason) {
        li.append(el('p', 'missable-note', `Do not miss this: ${t.missable_reason}`));
      }
      if (t.target != null) {
        const counter = el('div', 'counter');
        const label = el('label', null, `${t.target_label}: `);
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.max = String(t.target);
        input.value = String(counterValue(t));
        input.setAttribute('aria-label', `Progress in ${t.target_label} for ${t.name}`);
        input.addEventListener('change', () => {
          state.counters[t.id] = Math.max(0, Math.min(t.target, Number(input.value) || 0));
          syncCounterEarned(t);
          save();
          render();
        });
        label.append(input);
        counter.append(label);
        const done = counterValue(t) >= t.target;
        counter.append(el('span', done ? 'counter-done' : 'counter-state',
          done ? `Complete — ${t.target} / ${t.target}` : `${counterValue(t)} / ${t.target}`));
        li.append(counter);
      }
      li.append(el('p', 'source', `Source: ${t.source}.`));
    }
    listEl.append(li);
    shown += 1;
    if (earned) earnedShown += 1;
  }

  const total = doc.trophies.length;
  const earnedTotal = state.earned.length;
  const pct = Math.round((earnedTotal / total) * 100);
  document.getElementById('earnedCount').textContent = String(earnedTotal);
  document.getElementById('barFill').style.width = `${pct}%`;
  document.getElementById('progressText').textContent = `${pct}% to the platinum`;
  document.getElementById('platinumNote').textContent =
    earnedTotal >= total ? 'Platinum earned. You are a Leonida Legend.' :
    earnedTotal >= total - 1 ? 'One trophy to go before the platinum.' :
    `${total - earnedTotal} trophies to go before the platinum.`;
  countLine.textContent = `Showing ${shown} of ${total} trophies` +
    (shown !== total ? ` (${earnedShown} earned in this view)` : ` — ${earnedTotal} earned, ${total - earnedTotal} to go`);
  emptyNote.hidden = shown !== 0;
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ app: 'leonida-legend', version: 1, earned: state.earned, counters: state.counters }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-legend-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

async function importProgress(file) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!Array.isArray(parsed.earned)) throw new Error('bad file');
    state.earned = parsed.earned.filter((id) => Number.isInteger(id) && id >= 1 && id <= 55);
    state.counters = {};
    if (parsed.counters && typeof parsed.counters === 'object') {
      for (const [id, value] of Object.entries(parsed.counters)) {
        const n = Number(value);
        if (Number.isInteger(Number(id)) && Number.isFinite(n) && n >= 0) state.counters[Number(id)] = n;
      }
    }
    for (const t of doc.trophies) syncCounterEarned(t);
    save();
    render();
  } catch {
    alert('That file is not a Leonida Legend progress export.');
  }
}

document.getElementById('exportBtn').addEventListener('click', exportProgress);
document.getElementById('importFile').addEventListener('change', (e) => {
  importProgress(e.target.files[0]);
  e.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Clear all earned trophies and counters? This cannot be undone.')) {
    state = { earned: [], counters: {}, spoilers: state.spoilers, hideEarned: state.hideEarned };
    save();
    render();
  }
});
for (const element of [searchEl, kindEl, gradeEl, statusEl, spoilersEl, hideEarnedEl]) {
  element.addEventListener('input', () => {
    if (element === spoilersEl || element === hideEarnedEl) {
      state.spoilers = spoilersEl.checked;
      state.hideEarned = hideEarnedEl.checked;
      save();
    }
    render();
  });
}
for (const chip of stageChips) {
  chip.addEventListener('click', () => {
    stageFilter = chip.dataset.stage;
    for (const c of stageChips) c.classList.toggle('active', c === chip);
    render();
  });
}

doc = await (await fetch('data/trophies.json')).json();
for (const t of doc.trophies) syncCounterEarned(t);
spoilersEl.checked = state.spoilers;
hideEarnedEl.checked = state.hideEarned;
save();
render();
