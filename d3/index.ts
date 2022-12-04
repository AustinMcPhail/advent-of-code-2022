import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const input = Deno.readTextFileSync(__dirname + "/input.txt");
const lines = input.split("\n");

const groupedLines = lines.reduce((groups, line, index) => {
  if (index % 3 === 0) groups.push([] as string[]);
  groups[groups.length - 1].push(line);
  return groups;
}, [] as string[][]);

const totalPriority = groupedLines.reduce((acc, group) => {
  const items = findCommonItems(
    group[0].split(""),
    group[1].split(""),
    group[2].split(""),
  );
  const priority = calculatePriority(items);
  return acc += priority;
}, 0);

console.log({ totalPriority });

function splitCompartments(line: string) {
  const a = line.slice(0, line.length / 2).split("");
  const b = line.slice(line.length / 2, line.length).split("");
  return [a, b];
}

function findCommonItems(
  ...inputs: string[][]
): string[] {
  const [first, ...rest] = inputs;
  return rest.flatMap((l) => l.filter((c) => first.includes(c)))
    .filter((v, i, self) => self.indexOf(v) === i)
    .filter((v) => rest.every((r) => r.includes(v)));
}

function calculatePriority(inputs: string[]) {
  return inputs.reduce((acc, inp) => acc += getPriority(inp), 0);
}

function getPriority(input: string): number {
  const PriorityMap: { [key: string]: number } = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 10,
    k: 11,
    l: 12,
    m: 13,
    n: 14,
    o: 15,
    p: 16,
    q: 17,
    r: 18,
    s: 19,
    t: 20,
    u: 21,
    v: 22,
    w: 23,
    x: 24,
    y: 25,
    z: 26,
  };
  if (input < "a") {
    return PriorityMap[input.toLowerCase()] + 26;
  } else return PriorityMap[input];
}
