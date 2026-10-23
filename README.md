# Dante's Inferno Test

A static, dependency-free recreation of the Dante's Inferno Test that ran at
4degreez.com from the early 2000s: 71 questions, ten destinations, and the
original scoring rules.

The original was a PHP page that scored a form POST server-side. This version
is plain HTML, CSS, and ES modules — it runs from any static host or straight
off the filesystem, and no answers leave the browser.

## Run it

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Any static server works; ES modules need
`http://`, so opening `index.html` via `file://` will not load the scripts.

## Test

```
npm test
```

Ten tests covering the question set, the level data, scoring determinism, the
percentage bands, and a coverage check that every question still moves at
least one level score.

## How the scoring works

Each of the ten levels starts with a raw score (Purgatory and Limbo start at
1, the rest at 0). Every answer nudges one or more levels up or down. Six
hidden counters — `holy`, `virtue`, `evil`, `fraud`, `suicide`, and `gay` —
tally across the whole sheet and then apply bonus swings at the end; a few
rules also fire on combinations, such as contradicting yourself about faith,
which reads as fraud.

Raw scores become percentages against a per-level maximum (`maxScores` in
[`js/levels.js`](js/levels.js)), so a score can exceed 100% or fall below
zero. The highest percentage is your fate; ties go to the shallower level.

## Files

| Path | What it holds |
| --- | --- |
| [`js/questions.js`](js/questions.js) | The 71 questions, in the original order, keyed by their original form field names |
| [`js/levels.js`](js/levels.js) | Level names, inhabitants, descriptions, per-level maximums, score bands |
| [`js/scoring.js`](js/scoring.js) | The scoring rules, ported from the original PHP |
| [`js/app.js`](js/app.js) | Form building, validation, and result rendering |

## Fidelity notes

The scoring is a direct port, quirks included:

- **`q68` never scores.** "Some people just deserve to die." is a true/false
  question, but the original compared its answer against `'1'`, so the rule
  could not fire. Kept as-is, and the test suite asserts it is the *only*
  inert question.
- **Scores run past 100% and below 0%.** The correction factors in
  `maxScores` do not bound the raw totals, so extreme answer sheets land well
  outside 0–100. The original did the same.
- **`dante_vars.php` was not recoverable.** Level names, inhabitant lists,
  and row colours are reconstructed from the published test rather than
  copied from source. The scoring rules and level descriptions are verbatim.

Changes from the original: all 71 questions must be answered before the test
will score (the original silently treated blanks as answers), results render
in place rather than on a second page, and the ad units, affiliate links, and
cross-promotions are gone.

## Licence

MIT, for this recreation. The test's questions and level descriptions are the
work of the original 4degreez.com authors.
