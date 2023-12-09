const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function getDistance(pushTime, totalTime) {
    return pushTime * (totalTime - pushTime);
}

function getWinnerSolutionCount(race) {
    let count = 0;
    for (let i = 0; i < race.time; i++) {
        if (getDistance(i, race.time) > race.distance) {
            count++;
        }
    }

    return count;
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const [rawTimes, rawDistances] = rawInput.split("\n");

    const times = rawTimes
        .split(/\s+/)
        .slice(1)
        .map((n) => parseInt(n));
    const distances = rawDistances
        .split(/\s+/)
        .slice(1)
        .map((n) => parseInt(n));

    races = times.map((time, index) => ({ time, distance: distances[index] }));

    const result = races.reduce((total, race) => total * getWinnerSolutionCount(race), 1);

    resolving.succeed(`Jour ${chalk.red(6)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
