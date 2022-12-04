import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const input = Deno.readTextFileSync(__dirname + "/input.txt");
const lines = input.split("\n");

let index = 0;
const elvesCarriedCalories = lines.reduce((elves, line) => {
  if (line === "") {
    index += 1;
    return elves;
  }
  if (elves[index]) elves[index] += `\n${line}`;
  else elves[index] = line;
  return elves;
}, [] as string[])
  .map((v) => {
    return v
      .split("\n")
      .map((v) => Number.parseInt(v))
      .reduce((acc, curr) => acc + curr, 0);
  });

const elvesSortedByCarriedCalories = elvesCarriedCalories.sort((a, b) => b - a);
const [first, second, third] = elvesSortedByCarriedCalories;
console.log({
  highest: first,
  totalOfHighestThree: first + second + third,
});
