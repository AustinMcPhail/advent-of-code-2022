import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const input = Deno.readTextFileSync(__dirname + "/input.txt");
const lines = input.split("\n");

const overlaps = lines.reduce((acc, line, i) => {
  const [elfA, elfB] = line.split(",");
  const [elfAStart, elfAEnd] = elfA.split("-").map((n) => +n);
  const [elfBStart, elfBEnd] = elfB.split("-").map((n) => +n);

  if (
    (elfAStart <= elfBStart && elfAEnd >= elfBStart) ||
    (elfAStart >= elfBStart && elfAStart <= elfBEnd) ||
    (elfAStart >= elfBStart && elfAEnd <= elfBEnd) ||
    (elfBStart <= elfAStart && elfBEnd >= elfAStart) ||
    (elfBStart >= elfAStart && elfBStart <= elfAEnd) ||
    (elfBStart >= elfAStart && elfBEnd <= elfAEnd)
  ) {
    return acc + 1;
  }

  return acc;
}, 0);

console.log({ overlaps });
