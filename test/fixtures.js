import { questions, YES_NO } from '../js/questions.js';

// Questions where answering "yes" / "true" is the virtuous answer. Everything
// else is virtuous when answered "no" / "false".
const PIOUS_AFFIRMATIVE = new Set([
  'q1', 'q8', 'q10', 'q18', 'q24', 'q28', 'q32', 'q34', 'q42', 'q44', 'q61', 'q62', 'q71',
]);

export function piousAnswers() {
  const a = {};
  for (const q of questions) {
    const yes = PIOUS_AFFIRMATIVE.has(q.name);
    a[q.name] = q.type === YES_NO ? (yes ? '1' : '0') : (yes ? 't' : 'f');
  }
  return a;
}

export function sinfulAnswers() {
  const a = {};
  for (const q of questions) {
    const yes = !PIOUS_AFFIRMATIVE.has(q.name);
    a[q.name] = q.type === YES_NO ? (yes ? '1' : '0') : (yes ? 't' : 'f');
  }
  return a;
}

export function flip(answers, name) {
  const q = questions.find((x) => x.name === name);
  const copy = { ...answers };
  copy[name] = q.type === YES_NO
    ? (answers[name] === '1' ? '0' : '1')
    : (answers[name] === 't' ? 'f' : 't');
  return copy;
}
