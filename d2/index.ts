import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const input = Deno.readTextFileSync(__dirname + "/input.txt");
const lines = input.split("\n");

type Move = "Rock" | "Paper" | "Scissors";
type Input = "A" | "B" | "C" | "X" | "Y" | "Z";
type Result = "win" | "lose" | "draw";
const ScoreMap = {
  "Rock": 1,
  "Paper": 2,
  "Scissors": 3,
};

const roundScores = lines.map((line) => {
  const [theirInput, desiredResultInput] = line.split(" ") as Input[];
  const theirMove = inputToMove(theirInput);
  const myMove = getMoveFromResult(
    theirMove,
    inputToResult(desiredResultInput),
  );
  const roundResult = getRoundResult(theirMove, myMove);
  let score = ScoreMap[myMove];
  if (roundResult === "win") score += 6;
  else if (roundResult === "draw") score += 3;
  return score;
});
const totalScore = roundScores.reduce((prev, curr) => prev + curr, 0);
console.log({ totalScore });

function getMoveFromResult(
  theirHand: Move,
  desiredResult: Result,
): Move {
  if (desiredResult === "win") {
    if (theirHand === "Rock") return "Paper";
    if (theirHand === "Paper") return "Scissors";
    if (theirHand === "Scissors") return "Rock";
  } else if (desiredResult === "draw") {
    if (theirHand === "Rock") return "Rock";
    if (theirHand === "Paper") return "Paper";
    if (theirHand === "Scissors") return "Scissors";
  } else if (desiredResult === "lose") {
    if (theirHand === "Rock") return "Scissors";
    if (theirHand === "Paper") return "Rock";
    if (theirHand === "Scissors") return "Paper";
  }
  throw new Error("Invalid input");
}

function getRoundResult(
  theirHand: Move,
  myHand: Move,
): Result {
  if (myHand === theirHand) return "draw";
  if (myHand === "Rock" && theirHand === "Paper") return "lose";
  if (myHand === "Paper" && theirHand === "Scissors") return "lose";
  if (myHand === "Scissors" && theirHand === "Rock") return "lose";

  if (myHand === "Rock" && theirHand === "Scissors") return "win";
  if (myHand === "Paper" && theirHand === "Rock") return "win";
  if (myHand === "Scissors" && theirHand === "Paper") return "win";

  throw new Error("Invalid input");
}

function inputToMove(input: Input): Move {
  if (input === "A") return "Rock";
  if (input === "B") return "Paper";
  if (input === "C") return "Scissors";
  throw new Error("Invalid input");
}

function inputToResult(input: Input): Result {
  if (input === "X") return "lose";
  if (input === "Y") return "draw";
  if (input === "Z") return "win";
  throw new Error("Invalid input");
}
