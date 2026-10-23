import { questions, trueFalseStart, YES_NO } from './questions.js';
import { levels } from './levels.js';
import { score, verdict } from './scoring.js';

const form = document.getElementById('quiz');
const list = document.getElementById('questions');
const validation = document.getElementById('validation');
const results = document.getElementById('results');
const scoreBody = document.querySelector('#score-table tbody');
const detail = document.getElementById('level-detail');
const progressBar = document.getElementById('progress-bar');

const LABELS = {
  [YES_NO]: [['1', 'Yes'], ['0', 'No']],
  't/f': [['t', 'True'], ['f', 'False']],
};

function buildForm() {
  const fragment = document.createDocumentFragment();

  questions.forEach((q, i) => {
    if (i === trueFalseStart) {
      const heading = document.createElement('li');
      heading.className = 'section-heading';
      heading.textContent = 'True / False';
      fragment.append(heading);
    }

    const item = document.createElement('li');
    item.className = 'question';
    item.dataset.name = q.name;

    const prompt = document.createElement('p');
    prompt.className = 'prompt';
    prompt.textContent = q.text;

    const choices = document.createElement('div');
    choices.className = 'choices';
    for (const [value, label] of LABELS[q.type]) {
      const wrapper = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = q.name;
      input.value = value;
      const span = document.createElement('span');
      span.textContent = label;
      wrapper.append(input, span);
      choices.append(wrapper);
    }

    item.append(prompt, choices);
    fragment.append(item);
  });

  list.append(fragment);
}

function readAnswers() {
  const data = new FormData(form);
  const answers = {};
  for (const q of questions) {
    const value = data.get(q.name);
    if (value !== null) answers[q.name] = value;
  }
  return answers;
}

function updateProgress() {
  const answered = Object.keys(readAnswers()).length;
  progressBar.style.width = `${(answered / questions.length) * 100}%`;
  return answered;
}

function markAnswered(name) {
  const item = list.querySelector(`[data-name="${name}"]`);
  if (item) {
    item.classList.add('answered');
    item.classList.remove('missing');
  }
}

function showLevel(index) {
  const level = levels[index];
  detail.style.setProperty('--level-color', level.color);
  detail.replaceChildren();

  const title = document.createElement('h3');
  title.textContent = level.title;

  const who = document.createElement('p');
  who.className = 'who';
  who.textContent = level.sinners;

  const body = document.createElement('p');
  body.className = 'body';
  body.textContent = level.description;

  detail.append(title, who, body);

  for (const row of scoreBody.children) {
    row.classList.toggle('selected', Number(row.dataset.index) === index);
  }
}

function renderResults(result) {
  const { verb, destination } = verdict(result.topLevel);

  document.getElementById('verdict-heading').textContent =
    result.topLevel > 1
      ? `The wretched King Minos has decided your fate. His tail wraps around his body ${result.topLevel} times.`
      : 'Your fate has been decided…';

  const line = document.getElementById('verdict-line');
  line.replaceChildren(
    document.createTextNode(
      result.topLevel > 1
        ? 'The sweet light no longer strikes against your eyes. Your shade has been banished to '
        : 'You are one of the lucky ones. Because of your virtue and beliefs, you have escaped eternal punishment. You are sent to ',
    ),
  );
  const em = document.createElement('em');
  em.textContent = `${destination}!`;
  line.append(em);
  line.dataset.verb = verb;

  scoreBody.replaceChildren();
  for (const row of result.rows) {
    const tr = document.createElement('tr');
    tr.dataset.index = String(row.index);
    tr.tabIndex = 0;

    const name = document.createElement('td');
    name.className = 'level-name';
    name.style.setProperty('--row-color', levels[row.index].color);
    name.textContent = row.name;

    const who = document.createElement('td');
    who.textContent = row.sinners;

    const band = document.createElement('td');
    band.className = `band-${row.band.toLowerCase().replace(/ /g, '-')}`;
    band.textContent = row.band;

    const pct = document.createElement('span');
    pct.className = 'pct';
    pct.textContent = ` (${row.percent}%)`;
    band.append(pct);

    tr.append(name, who, band);
    scoreBody.append(tr);
  }

  showLevel(result.topLevel);

  results.hidden = false;
  form.hidden = true;
  document.getElementById('intro').hidden = true;
  results.scrollIntoView({ block: 'start' });
}

function shareText(result) {
  const { verb, destination } = verdict(result.topLevel);
  const lines = [
    `The Dante's Inferno Test ${verb} to ${destination}!`,
    '',
    'Here is how I matched up against all the levels:',
    '',
    ...result.rows.map((r) => `${r.name} | ${r.band}`),
  ];
  return lines.join('\n');
}

let lastResult = null;

form.addEventListener('change', (event) => {
  if (event.target.name) markAnswered(event.target.name);
  updateProgress();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const answers = readAnswers();
  const missing = questions.filter((q) => !(q.name in answers));

  if (missing.length > 0) {
    for (const q of missing) {
      list.querySelector(`[data-name="${q.name}"]`)?.classList.add('missing');
    }
    validation.textContent =
      missing.length === 1
        ? 'One question is still unanswered. Minos cannot judge an incomplete soul.'
        : `${missing.length} questions are still unanswered. Minos cannot judge an incomplete soul.`;
    validation.hidden = false;
    list.querySelector(`[data-name="${missing[0].name}"]`)
      ?.scrollIntoView({ block: 'center' });
    return;
  }

  validation.hidden = true;
  lastResult = score(answers);
  renderResults(lastResult);
});

scoreBody.addEventListener('click', (event) => {
  const row = event.target.closest('tr');
  if (row) showLevel(Number(row.dataset.index));
});

scoreBody.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const row = event.target.closest('tr');
  if (row) {
    event.preventDefault();
    showLevel(Number(row.dataset.index));
  }
});

document.getElementById('copy').addEventListener('click', async (event) => {
  if (!lastResult) return;
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(shareText(lastResult));
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Copy failed';
  }
  setTimeout(() => { button.textContent = 'Copy my result'; }, 2000);
});

document.getElementById('retake').addEventListener('click', () => {
  form.reset();
  for (const item of list.querySelectorAll('.question')) {
    item.classList.remove('answered', 'missing');
  }
  lastResult = null;
  results.hidden = true;
  form.hidden = false;
  document.getElementById('intro').hidden = false;
  updateProgress();
  window.scrollTo({ top: 0 });
});

buildForm();
updateProgress();
