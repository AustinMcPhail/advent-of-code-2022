import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const input = Deno.readTextFileSync(__dirname + "/input.txt");
const lines = input.split("\n");

const stackNumbersIndex = lines.findIndex((s) => !s.includes("["));
if (!stackNumbersIndex) throw new Error("Could not find stack numbers");
const stackLines = lines.splice(0, stackNumbersIndex);
const stackIndexArray = lines.splice(0, 1)[0].split("").reduce(
  (acc, value, i) => {
    if (value === " ") return acc;
    return [...acc, i];
  },
  [] as number[],
);
const instructions = lines.filter((l) => l !== "").reduce((acc, l, i) => {
  const numbers: string[] | null = l.match(/\d+/g);
  if (!numbers) throw new Error("Could not find instruction on line " + i);
  const [move, from, to] = numbers.map((n) => Number.parseInt(n));
  return [...acc, { move, from: `${from}`, to: `${to}` }];
}, [] as { move: number; from: string; to: string }[]);
const reversedStackLines = stackLines.reverse();
const stacks = stackIndexArray.reduce((acc, si, i) => {
  acc[`${i + 1}`] = [];
  reversedStackLines.forEach((l) => {
    const label = l[si].trim();
    if (label) acc[`${i + 1}`].push(label);
  });
  return acc;
}, {} as { [key: string]: string[] });
instructions.forEach(({ move, from, to }) => {
  let poppedArray = [];
  for (let i = 0; i < move; i++) {
    const popped = stacks[from].pop();
    if (!popped) throw new Error("No value to pop");
    poppedArray.push(popped);
  }
  poppedArray = poppedArray.reverse();
  stacks[to].push(...poppedArray);
});
console.log({
  stacks,
  topOfStacks: Object.values(stacks).map((s) => {
    return s[s.length - 1];
  }).join(""),
});
