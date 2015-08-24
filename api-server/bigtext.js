
// This is the most important thing.

import colors from 'colors';

let letterColors = ['red', 'green', 'blue'];
let lines = [];
const M = [
  ".-.   .-.",
  "|  `.'  |",
  "| |\\ /| |",
  "`-' ` `-'",
].join("\n");

const L = [
  ".-.   ",
  "| |   ",
  "| `--.",
  "`----'",
].join("\n");

const B = [
  ".----.",
  "| {}  }",
  "| {}  }",
  "`----'",
].join("\n");
[M, L, B].forEach(function(letter, i) {
  let color = letterColors[i];
  letter
    .split('\n')
    .forEach(function(line, j) {
      if (!lines[j]) {
        lines[j] = '';
      }
      lines[j] = lines[j] + line[color];
    });
});

export default lines.join('\n');
