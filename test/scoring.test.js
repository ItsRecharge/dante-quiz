import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { score, verdict } from '../js/scoring.js';
import { levels, maxScores, band } from '../js/levels.js';
import { questions } from '../js/questions.js';
import { piousAnswers, sinfulAnswers, flip } from './fixtures.js';

// The original form asked 71 scored questions.
test('question set matches the original form', () => {
  assert.equal(questions.length, 71);
  assert.equal(new Set(questions.map((q) => q.name)).size, 71);
  const yesNo = questions.filter((q) => q.type === '1/0');
  const trueFalse = questions.filter((q) => q.type === 't/f');
  assert.equal(yesNo.length, 57);
  assert.equal(trueFalse.length, 14);
  // True/false questions all come last, as they did on the original page.
  assert.deepEqual(
    questions.map((q) => q.type),
    [...yesNo.map(() => '1/0'), ...trueFalse.map(() => 't/f')],
  );
});

test('there are ten destinations with correction-factored maximums', () => {
  assert.equal(levels.length, 10);
  assert.deepEqual(maxScores, [25, 20, 15, 13, 18, 21, 18, 22, 26, 16]);
  for (const level of levels) {
    assert.ok(level.name && level.title && level.sinners);
    assert.ok(level.description.length > 200);
  }
});

test('every question except q68 moves at least one level score', () => {
  const baselines = [piousAnswers(), sinfulAnswers()];
  const inert = [];
  for (const q of questions) {
    const moves = baselines.some(
      (b) => JSON.stringify(score(b).percents) !== JSON.stringify(score(flip(b, q.name)).percents),
    );
    if (!moves) inert.push(q.name);
  }
  // q68 is a true/false question the original compared against '1', so its
  // rule could never fire. Faithfully preserved; nothing else may be inert.
  assert.deepEqual(inert, ['q68']);
});

test('a virtuous sheet lands in Purgatory', () => {
  const result = score(piousAnswers());
  assert.equal(result.topLevel, 0);
  assert.equal(result.rows[0].band, 'Extreme');
  assert.equal(verdict(0).destination, 'Purgatory');
  assert.equal(verdict(0).verb, 'has sent you');
});

test('a thoroughly sinful sheet is damned, not spared', () => {
  const result = score(sinfulAnswers());
  assert.notEqual(result.topLevel, 0);
  assert.ok(result.topLevel >= 7, `expected a deep circle, got ${result.topLevel}`);
  assert.ok(result.percents[0] < 0);
  assert.equal(verdict(result.topLevel).verb, 'has banished you');
  assert.match(verdict(result.topLevel).destination, /^the /);
});

test('scoring is deterministic and self-consistent', () => {
  const answers = piousAnswers();
  const a = score(answers);
  const b = score(answers);
  assert.deepEqual(a, b);
  assert.equal(a.percents.length, 10);
  assert.equal(a.rows.length, 10);
  for (const p of a.percents) assert.ok(Number.isInteger(p));
  // topLevel is the first index holding the maximum, matching the original's
  // strict > comparison starting from level 0.
  const max = Math.max(...a.percents);
  assert.equal(a.topScore, max);
  assert.equal(a.topLevel, a.percents.indexOf(max));
});

test('percentages come from raw score over the level maximum', () => {
  const result = score(sinfulAnswers());
  for (let i = 0; i < 10; ++i) {
    const raw = (result.percents[i] * maxScores[i]) / 100;
    // floor() means the recovered raw score is within one unit of an integer.
    assert.ok(Math.abs(raw - Math.round(raw)) < 1);
  }
});

test('bands use the original thresholds', () => {
  assert.equal(band(-16), 'Very Low');
  assert.equal(band(-15), 'Low');
  assert.equal(band(14), 'Low');
  assert.equal(band(15), 'Moderate');
  assert.equal(band(34), 'Moderate');
  assert.equal(band(35), 'High');
  assert.equal(band(64), 'High');
  assert.equal(band(65), 'Very High');
  assert.equal(band(99), 'Very High');
  assert.equal(band(100), 'Extreme');
});

test('unanswered sheets still score without throwing', () => {
  const result = score({});
  assert.equal(result.percents.length, 10);
  assert.ok(Number.isInteger(result.topScore));
});

test('every question name is referenced by the scoring rules', () => {
  const source = readFileSync(new URL('../js/scoring.js', import.meta.url), 'utf8');
  for (const q of questions) {
    assert.match(source, new RegExp(`a\\.${q.name}\\b`), `${q.name} has no rule`);
  }
});
