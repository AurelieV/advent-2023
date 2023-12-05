const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function convert(value, map) {
    const convertionLine = map.find((line) => line.startOrigin <= value && line.startOrigin + line.length > value);
    if (!convertionLine) return value;
    const index = value - convertionLine.startOrigin;
    return convertionLine.startDestination + index;
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const [rawSeeds, ...rawMaps] = rawInput.split("\n\n");

    const seeds = rawSeeds
        .replace("seeds: ", "")
        .split(" ")
        .map((n) => parseInt(n));

    const maps = rawMaps.map((rawMap) => {
        const lines = rawMap.split("\n").slice(1);

        return lines.map((line) => {
            const [startDestination, startOrigin, length] = line.split(" ").map((n) => parseInt(n));
            return {
                startDestination,
                startOrigin,
                length,
            };
        });
    });

    const locations = seeds.map((seed) => {
        const location = maps.reduce((acc, map) => convert(acc, map), seed);
        return location;
    });

    const result = Math.min(...locations);

    resolving.succeed(`Jour ${chalk.red(5)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
