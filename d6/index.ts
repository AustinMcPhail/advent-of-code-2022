import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const input = Deno.readTextFileSync(__dirname + "/input.txt");
const lines = input.split("\n");

const line = lines[0];
let found = false;
let firstMarker = 0;
for (let cursor = 14; cursor < line.length && !found; cursor++) {
  const bits = line.slice(cursor - 14, cursor);
  const duplicates = bits.split("").filter((v, i, self) =>
    self.indexOf(v) !== i
  );
  if (duplicates.length === 0) {
    found = true;
    firstMarker = cursor;
  }
}
console.log(`first message: ${firstMarker}`);
