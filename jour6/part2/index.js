const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function getWinnerSolutionCount(race) {
    const delta = Math.pow(race.time, 2) - 4 * race.distance;

    const x1 = Math.max(0, (race.time - Math.sqrt(delta)) / 2);
    const x2 = Math.min(race.time, (race.time + Math.sqrt(delta)) / 2);

    const count = Math.floor(x2) - Math.ceil(x1) + 1;

    return count;
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const [rawTimes, rawDistances] = rawInput.split("\n");

    const time = parseInt(rawTimes.split(/\s+/).slice(1).join(""));
    const distance = parseInt(rawDistances.split(/\s+/).slice(1).join(""));

    const race = { time, distance };
    const result = getWinnerSolutionCount(race);

    resolving.succeed(`Jour ${chalk.red(6)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
