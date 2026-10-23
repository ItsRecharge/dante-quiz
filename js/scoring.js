// Direct port of the original dante-inferno-test2.mv scoring script.
// Answers come in as a plain object of POST-style strings: '1'/'0' for the
// yes/no questions and 't'/'f' for the true/false ones. Rules are kept in the
// original order, including the ones that only fire on combinations.

import { levels, maxScores, band } from './levels.js';

export function score(answers) {
  const a = answers;
  const lev = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
  let suicide = 0;
  let holy = 0;
  let fraud = 0;
  let gay = 0;
  let virtue = 0;
  let evil = 0;

  if (a.q1 === '0') {
    lev[0] -= 2; lev[1] += 1; lev[6] += 2; lev[8] += 1; lev[9] += 1;
  } else {
    lev[0] += 3; lev[1] += 1; holy += 1;
  }

  if (a.q2 === '1') lev[2] += 1;

  if (a.q3 === '1') { lev[3] += 1; lev[4] += 2; }

  if (a.q4 === '1') { lev[5] += 1; lev[7] += 2; suicide += 1; }

  if (a.q5 === '1') { lev[8] += 2; lev[1] -= 1; }
  else lev[1] += 1;

  if (a.q6 === '1') { lev[1] -= 1; lev[2] += 2; lev[9] += 3; evil += 1; }
  else lev[1] += 1;

  if (a.q7 === '1') lev[8] += 2;

  if (a.q8 === '1') { lev[0] += 1; lev[1] += 1; lev[4] -= 1; lev[6] -= 1; virtue += 1; }
  else { lev[3] += 1; lev[4] += 2; }

  if (a.q9 === '1') lev[5] += 2;

  if (a.q10 === '1') { lev[0] += 1; lev[6] -= 3; holy += 1; }
  else { lev[6] += 4; lev[0] -= 3; }

  if (a.q11 === '1') { lev[1] -= 1; lev[8] += 2; lev[9] += 1; }
  else lev[8] -= 1;

  if (a.q12 === '1') { lev[1] -= 1; lev[8] += 2; fraud += 1; }
  else virtue += 1;

  if (a.q13 === '1') lev[2] += 2;
  else { lev[2] -= 1; virtue += 1; }

  if (a.q14 === '1') lev[5] += 3;
  else lev[5] -= 1;

  if (a.q15 === '1') { lev[7] += 2; suicide += 1; }

  if (a.q16 === '1') { lev[1] -= 2; lev[5] += 1; lev[6] += 1; lev[7] += 2; evil += 1; }

  if (a.q15 === '0' && a.q16 === '0') lev[7] -= 1;

  if (a.q17 === '1') { lev[1] -= 1; lev[3] += 1; lev[4] += 2; }
  else lev[4] -= 1;

  if (a.q18 === '1') { lev[9] -= 1; virtue += 1; }
  else lev[9] += 3;

  if (a.q19 === '1') lev[2] += 2;
  else { lev[0] += 1; lev[1] += 2; lev[2] -= 2; virtue += 1; }

  if (a.q20 === '1') { lev[0] -= 2; lev[1] += 2; lev[6] += 1; }
  else { lev[0] += 1; lev[6] -= 1; }

  if (a.q21 === '1') { lev[0] -= 1; lev[7] += 2; }
  else { lev[0] += 1; lev[7] -= 1; }

  if (a.q22 === '1') { lev[5] += 1; lev[7] += 1; }

  if (a.q23 === '1') lev[2] += 2;
  else lev[1] += 1;

  if (a.q24 === '1') {
    lev[0] += 2; lev[1] += 1; lev[6] -= 1; lev[7] -= 1; lev[9] -= 1; holy += 1;
  } else lev[0] -= 2;

  // Inconsistent answers about faith read as fraud.
  if (a.q1 !== a.q10 || a.q24 !== a.q10) { lev[8] += 1; fraud += 1; }
  else { lev[0] += 2; lev[1] -= 2; }

  if (a.q25 === '1') { lev[5] += 2; lev[9] += 1; }
  else { lev[1] += 1; lev[5] -= 1; }

  if (a.q26 === '1') lev[9] += 2;
  else lev[9] -= 1;

  if (a.q27 === '1') { lev[7] += 2; suicide += 1; }

  if (a.q28 === '1') { lev[4] -= 2; virtue += 1; }
  else lev[4] += 1;

  if (a.q29 === '1') { lev[0] -= 1; lev[1] -= 1; lev[3] += 1; lev[4] += 2; }
  else { lev[4] -= 1; virtue += 1; }

  if (a.q30 === '1') { lev[8] += 1; fraud += 1; }

  if (a.q31 === '1') { lev[0] -= 1; lev[8] += 1; }

  if (a.q32 === '1') { lev[0] += 3; lev[6] -= 1; holy += 1; }
  else lev[0] -= 3;

  if ((a.q32 === '0' && a.q1 === '1') || (a.q32 === '0' && a.q10 === '1' && a.q24 === '1')) {
    fraud += 1;
  }

  if (a.q33 === '1') { lev[1] -= 1; lev[4] += 2; }

  if (a.q34 === 't') { lev[0] += 2; lev[6] -= 3; holy += 1; }
  else { lev[0] -= 2; lev[1] += 1; lev[5] += 1; lev[6] += 2; }

  if (a.q35 === 't') { lev[0] -= 1; lev[1] -= 2; lev[5] += 1; lev[7] += 2; }

  if (a.q36 === 't') { lev[1] -= 1; lev[4] += 2; evil += 1; }
  else { lev[1] += 1; lev[4] -= 1; }

  if (a.q37 === 't') { lev[0] -= 1; lev[1] += 1; lev[6] += 1; lev[7] += 1; }
  else { lev[0] += 1; lev[6] -= 1; }

  if (a.q38 === 't') { lev[0] -= 1; lev[1] -= 2; lev[5] += 3; }
  else lev[5] -= 1;

  if (a.q39 === 't') { lev[0] -= 3; lev[6] += 3; lev[8] += 1; }
  else { lev[0] += 1; lev[6] -= 1; holy += 1; }

  if (a.q1 === '1' && a.q39 === 't') fraud += 1;

  if (a.q10 === '1' && a.q39 === 't') lev[1] += 2;

  if (a.q40 === 't') lev[8] += 1;

  if (a.q41 === 't') { lev[0] -= 1; lev[1] -= 2; lev[5] += 1; lev[9] += 2; }
  else lev[9] -= 1;

  if (a.q18 === '0' && a.q41 === 'f') { lev[8] += 1; lev[9] += 1; }

  if (a.q42 === '1') { lev[0] += 2; lev[1] += 2; virtue += 1; }
  else {
    lev[0] -= 2; lev[1] -= 2;
    for (let i = 2; i < 10; ++i) lev[i] += 1;
  }

  if (a.q43 === 't') { lev[1] -= 1; lev[4] += 2; }
  else lev[4] -= 1;

  if (a.q29 === '1' && a.q43 === 'f') lev[8] += 1;

  if (a.q44 === '1') { lev[0] += 1; holy += 1; }
  else { lev[0] -= 2; lev[6] += 2; }

  if (a.q45 === '1') { lev[1] -= 1; lev[5] += 3; }
  else { lev[5] -= 2; virtue += 1; }

  if (a.q46 === '1') { lev[0] -= 1; lev[1] -= 1; lev[7] += 2; lev[9] += 2; evil += 1; }
  else lev[9] -= 1;

  if (a.q47 === '1') { lev[5] += 2; lev[7] += 1; evil += 1; }
  else { lev[1] += 1; lev[5] -= 1; }

  if (a.q48 === '1') { lev[0] -= 2; lev[1] += 1; lev[6] += 2; }
  else lev[0] += 2;

  if (a.q49 === '1') { lev[4] += 1; lev[8] += 2; }
  else lev[1] += 1;

  if (a.q50 === '1') { lev[2] += 1; lev[7] += 2; }
  else lev[7] -= 1;

  if (a.q51 === '1') { lev[1] -= 1; lev[8] += 2; fraud += 1; }

  if (a.q52 === '1') lev[2] += 2;

  if (a.q53 === '1') { lev[1] -= 1; lev[8] += 3; evil += 1; }

  if (a.q54 === 't') { lev[1] -= 1; lev[8] += 2; fraud += 1; }

  if (a.q55 === 't') { lev[1] -= 1; lev[5] += 1; lev[8] += 2; }

  if (a.q56 === 't') { lev[0] -= 1; lev[1] -= 1; lev[8] += 2; }

  if (a.q57 === '1') lev[3] += 2;

  if (a.q58 === '1') lev[3] += 1;

  if (a.q59 === '1') { lev[7] += 1; gay += 1; }

  if (a.q60 === '1') { lev[0] -= 1; lev[2] += 1; lev[7] += 3; gay += 1; }

  if (a.q61 === 't') { lev[0] += 1; lev[1] += 1; lev[3] -= 1; }
  else lev[3] += 1;

  if (a.q62 === '1') { lev[2] -= 1; lev[3] += 2; }
  else { lev[2] += 1; lev[3] -= 1; }

  if (a.q63 === '1') lev[3] += 2;
  else lev[3] -= 2;

  if (a.q64 === '1' || a.q65 === '1') lev[4] += 2;

  if (a.q64 === '0' && a.q65 === '0') lev[4] -= 2;

  if (a.q66 === '1') { lev[7] += 2; suicide += 1; }
  else lev[7] -= 1;

  if (a.q67 === '1') lev[2] += 1;
  else lev[2] -= 1;

  // Original compared this true/false answer against '1', so it never fired.
  // Kept as-is so results match the 4degreez version.
  if (a.q68 === '1') { lev[5] += 1; lev[7] += 1; }

  if (a.q69 === '1') { lev[8] += 2; evil += 1; }

  if (a.q70 === '1') { lev[0] -= 3; lev[1] -= 1; }
  else { lev[0] += 1; lev[1] += 1; }

  if (a.q71 === '1') lev[4] -= 1;
  else lev[4] += 1;

  if (a.q42 === '1' && a.q70 === '1') { lev[0] -= 1; lev[1] -= 2; lev[8] += 2; }

  // bonus factors!
  if (holy > 5) { lev[0] += 3; lev[1] -= 3; }
  else if (holy === 5) { lev[0] += 2; lev[1] -= 2; }
  else if (holy === 4) { lev[0] += 1; lev[1] -= 1; }
  else if (holy < 3) {
    lev[0] -= 1; lev[1] += 1; lev[5] += 1; lev[6] += 1;
    lev[7] += 1; lev[8] += 1; lev[9] += 1;
  }

  if (suicide === 2) lev[7] += 1;
  else if (suicide > 3) lev[7] += suicide;

  if (fraud > 5) lev[8] += 4;
  else if (fraud > 3) lev[8] += 2;
  else if (fraud === 3) lev[7] += 1;

  if (gay === 2) {
    lev[0] -= 1;
    if (lev[2] > 7) { lev[2] -= 2; lev[7] += 5; }
    else { lev[2] -= 1; lev[7] += 4; }
  }

  if (virtue > 6) { lev[0] += 1; lev[1] += 2; lev[6] -= 2; }
  else if (virtue > 4) { lev[1] += 1; lev[6] -= 1; }
  else if (virtue === 4) { lev[0] -= 1; lev[1] -= 1; }
  else {
    lev[0] -= 1; lev[1] -= 1;
    for (let i = 2; i < 10; ++i) lev[i] += 1;
  }

  if (evil > 4) {
    lev[0] -= 5; lev[1] -= 5; lev[6] += 1; lev[7] += 1; lev[8] += 1; lev[9] += 1;
  } else if (evil > 2) { lev[0] -= 3; lev[1] -= 4; }
  else if (evil > 0) { lev[0] -= 1; lev[1] -= 2; }

  const percents = lev.map((raw, i) => Math.floor((100 * raw) / maxScores[i]));

  let topScore = percents[0];
  let topLevel = 0;
  for (let i = 1; i < 10; ++i) {
    if (percents[i] > topScore) {
      topScore = percents[i];
      topLevel = i;
    }
  }

  return {
    percents,
    topLevel,
    topScore,
    factors: { suicide, holy, fraud, gay, virtue, evil },
    rows: percents.map((p, i) => ({
      index: i,
      name: levels[i].name,
      sinners: levels[i].sinners,
      percent: p,
      band: band(p),
    })),
  };
}

// "The Dante's Inferno Test has banished you to the Seventh Level of Hell!"
export function verdict(topLevel) {
  const article = topLevel > 0 ? 'the ' : '';
  const verb = topLevel > 1 ? 'has banished you' : 'has sent you';
  return {
    verb,
    destination: `${article}${levels[topLevel].title}`,
  };
}
