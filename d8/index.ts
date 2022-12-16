import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const input = Deno.readTextFileSync(__dirname + "/input.txt");
const lines = input.split("\n");

const treeGrid = lines.reduce((acc, line) => {
  const trees = line
    .split("")
    .map((n) => {
      return { height: Number.parseInt(n) };
    });
  return [...acc, trees];
}, [] as { height: number }[][]);

const analyzedTreeGrid = treeGrid.map((row, r) => {
  return row.map(({ height }, c) => ({
    height,
    isVisible: isVisibleFromOutside(height, { r, c }, treeGrid),
    score: getScore(height, { r, c }, treeGrid),
  }));
});

const visibleTrees =
  analyzedTreeGrid.flatMap((r) => r).filter((t) => t.isVisible).length;
const highestScenicScore =
  analyzedTreeGrid.flatMap((r) => r).sort((a, b) => b.score - a.score)[0].score;

console.log(analyzedTreeGrid);
console.log(`Trees Visible: ${visibleTrees}`);
console.log(`Highest Scenic Score: ${highestScenicScore}`);

function isVisibleFromOutside(
  height: number,
  pos: { r: number; c: number },
  grid: { height: number }[][],
) {
  return isVisibleFromUp(height, pos, grid) ||
    isVisibleFromDown(height, pos, grid) ||
    isVisibleFromLeft(height, pos, grid) ||
    isVisibleFromRight(height, pos, grid);
}

function isVisibleFromLeft(
  height: number,
  pos: { r: number; c: number },
  grid: { height: number }[][],
) {
  const row = grid[pos.r];
  const treesToTheLeft = row.slice(0, pos.c);
  if (treesToTheLeft.find((t) => t.height >= height)) return false;
  return true;
}
function isVisibleFromRight(
  height: number,
  pos: { r: number; c: number },
  grid: { height: number }[][],
) {
  const row = grid[pos.r];
  const treesToTheRight = row.slice(pos.c + 1, row.length);
  if (treesToTheRight.find((t) => t.height >= height)) return false;
  return true;
}
function isVisibleFromUp(
  height: number,
  pos: { r: number; c: number },
  grid: { height: number }[][],
) {
  const column = grid.map((r) => r[pos.c]);
  const treesToTheUp = column.slice(0, pos.r);
  if (treesToTheUp.find((t) => t.height >= height)) return false;
  return true;
}
function isVisibleFromDown(
  height: number,
  pos: { r: number; c: number },
  grid: { height: number }[][],
) {
  const column = grid.map((r) => r[pos.c]);
  const treesToTheDown = column.slice(pos.r + 1, column.length);
  if (treesToTheDown.find((t) => t.height >= height)) return false;
  return true;
}

function getScore(
  height: number,
  pos: { r: number; c: number },
  grid: { height: number }[][],
) {
  return treesVisibleToTheUp(height, pos, grid) *
    treesVisibleToTheDown(height, pos, grid) *
    treesVisibleToTheLeft(height, pos, grid) *
    treesVisibleToTheRight(height, pos, grid);
}

function treesVisibleToTheLeft(
  height: number,
  pos: { r: number; c: number },
  grid: { height: number }[][],
) {
  const row = grid[pos.r];
  const treesToTheLeft = row.slice(0, pos.c).reverse();
  const indexOfFirstBlockingTree = treesToTheLeft.findIndex((t) =>
    t.height >= height
  );
  if (indexOfFirstBlockingTree === -1) return treesToTheLeft.length;
  return treesToTheLeft.slice(0, indexOfFirstBlockingTree + 1).length || 1;
}
function treesVisibleToTheRight(
  height: number,
  pos: { r: number; c: number },
  grid: { height: number }[][],
) {
  const row = grid[pos.r];
  const treesToTheRight = row.slice(pos.c + 1, row.length);
  const indexOfFirstBlockingTree = treesToTheRight.findIndex((t) =>
    t.height >= height
  );
  if (indexOfFirstBlockingTree === -1) return treesToTheRight.length;
  return treesToTheRight.slice(0, indexOfFirstBlockingTree + 1).length || 1;
}
function treesVisibleToTheUp(
  height: number,
  pos: { r: number; c: number },
  grid: { height: number }[][],
) {
  const column = grid.map((r) => r[pos.c]);
  const treesToTheUp = column.slice(0, pos.r).reverse();
  const indexOfFirstBlockingTree = treesToTheUp.findIndex((t) =>
    t.height >= height
  );
  if (indexOfFirstBlockingTree === -1) return treesToTheUp.length;
  return treesToTheUp.slice(0, indexOfFirstBlockingTree + 1).length || 1;
}
function treesVisibleToTheDown(
  height: number,
  pos: { r: number; c: number },
  grid: { height: number }[][],
) {
  const column = grid.map((r) => r[pos.c]);
  const treesToTheDown = column.slice(pos.r + 1, column.length);
  const indexOfFirstBlockingTree = treesToTheDown.findIndex((t) =>
    t.height >= height
  );
  if (indexOfFirstBlockingTree === -1) return treesToTheDown.length;
  return treesToTheDown.slice(0, indexOfFirstBlockingTree + 1).length || 1;
}
