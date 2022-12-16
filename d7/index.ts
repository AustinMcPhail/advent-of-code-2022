import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const input = Deno.readTextFileSync(__dirname + "/input.txt");
const lines = input.split("\n").reverse();
const numberOfDirectories = lines.filter((l) => l.includes("dir ")).filter((
  v,
  i,
  self,
) => self.indexOf(v) === i).length + 1;

type Directory = {
  [key: string]: File | Directory;
};

type File = {
  name: string;
  size: number;
};

type Command = "print" | `go ${"up" | "root" | string}`;
function stringToCommand(cmd: string): Command {
  if (cmd === "ls") {
    return "print";
  }
  if (cmd === "cd ..") {
    return "go up";
  } else if (cmd === "cd /") {
    return "go root";
  } else if (cmd.includes("cd ")) {
    const directoryName = cmd.split("cd ")[1];
    return `go ${directoryName}`;
  }
  throw new Error(`Unrecognized command: ${cmd}`);
}

function createIfNotExistAndGetDirectory(
  cursor: string,
  fs: Directory,
): Directory {
  const steps = cursor.split(".");
  return steps.reduce((position, s) => {
    if (!position) {
      return position[s] as Directory;
    }
    if (!position[s]) {
      position[s] = {};
      return position[s] as Directory;
    } else {
      return position[s] as Directory;
    }
  }, fs);
}
const commands: string[] = [];
const outputs: string[][] = [[]];
while (lines.length > 0) {
  const line = lines.pop();
  if (!line) throw new Error("EOF");
  if (line.includes("$ ")) commands.push(line.split("$ ")[1]);
  else {
    outputs[outputs.length - 1].push(line);
    if (lines.length && lines[lines.length - 1].includes("$ ")) {
      outputs.push([]);
    }
  }
}

const fileSystem: Directory = {
  ["/"]: {},
};
let cursor = "/";
let printIndex = 0;
commands.forEach((str) => {
  const cmd = stringToCommand(str);
  if (cmd === "go root") {
    cursor = "/";
  } else if (cmd === "go up") {
    cursor = cursor.split(".").slice(0, cursor.split(".").length - 1).join(
      ".",
    );
  } else if (cmd.includes("go ")) {
    const destination = cmd.split("go ")[1];
    cursor = `${cursor}.${destination}`;
    createIfNotExistAndGetDirectory(cursor, fileSystem);
  } else if (cmd === "print") {
    outputs[printIndex].forEach((out) => {
      if (out.includes("dir ")) {
        const directoryToAdd = out.split("dir ")[1];
        const currentDirectory = createIfNotExistAndGetDirectory(
          cursor,
          fileSystem,
        );
        currentDirectory[directoryToAdd] = {};
      } else {
        const [size, name] = out.split(" ");
        const currentDirectory = createIfNotExistAndGetDirectory(
          cursor,
          fileSystem,
        );
        currentDirectory[name] = {
          name,
          size: +size,
        };
      }
    });
    printIndex += 1;
  }
});

const sizeMap: { [key: string]: number } = {};
traverseAndCountSize("", fileSystem, sizeMap);

// Part 1
const belowLimit = Object.entries(sizeMap).filter((v) => v[1] <= 100000);
const sumOfBelowLimitDirectories = belowLimit.map((v) => v[1]).reduce(
  (acc, v) => acc += v,
  0,
);

// Part 2
const totalSpace = 70000000;
const updateSize = 30000000;
const unusedSpace = totalSpace - sizeMap["/"];
const spaceRequired = updateSize - unusedSpace;

const bigEnoughDirectories = Object.keys(sizeMap).filter((k) =>
  sizeMap[k] >= spaceRequired
).sort((a, b) => sizeMap[a] - sizeMap[b]);
const smallestLargeDirectoryToDelete = bigEnoughDirectories[0];
console.log({
  directory: smallestLargeDirectoryToDelete,
  size: sizeMap[smallestLargeDirectoryToDelete],
});

function traverseAndPrint(dir: Directory, indent = "|") {
  Object.keys(dir).forEach((k) => {
    console.log(`-${indent}${k}`, getSize(dir[k]));
    if (!dir[k].name) traverseAndPrint(dir[k] as Directory, `-${indent}`);
  });
}
function traverseAndCountSize(
  path: string,
  start: Directory,
  sizeMap: { [key: string]: number },
) {
  Object.keys(start).forEach((k) => {
    const dirPath = `${path === "/" ? "" : path}/${k === "/" ? "" : k}`;
    if (!start[k].name && !sizeMap[dirPath]) {
      sizeMap[dirPath] = getSize(start[k]);
      traverseAndCountSize(dirPath, start[k] as Directory, sizeMap);
    }
  });
}

function getSize(input: Directory | File): number {
  if (typeof input.size === "number") return input.size;
  const dir = input as Directory;
  return Object.keys(dir).reduce((size, curr) => {
    return size += getSize(dir[curr]);
  }, 0);
}
