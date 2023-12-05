const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function getIntersection(range1, range2) {
    if (range1.start + range1.length - 1 < range2.start) return { intersection: null, remainingRanges: [range1] };
    if (range2.start + range2.length - 1 < range1.start) return { intersection: null, remainingRanges: [range1] };
    if (range2.start <= range1.start && range1.start + range1.length <= range2.start + range2.length) {
        return {
            intersection: { start: range1.start, length: range1.length },
            remainingRanges: [],
        };
    }
    if (range1.start <= range2.start && range2.start + range2.length <= range1.start + range1.length) {
        return {
            intersection: { start: range2.start, length: range2.length },
            remainingRanges: [
                { start: range1.start, length: range2.start - range1.start },
                {
                    start: range2.start + range2.length,
                    length: range1.start + range1.length - range2.start - range2.length,
                },
            ],
        };
    }
    if (range1.start <= range2.start && range1.start + range1.length <= range2.start + range2.length) {
        return {
            intersection: { start: range2.start, length: range1.start + range1.length - range2.start },
            remainingRanges: [{ start: range1.start, length: range2.start - range1.start }],
        };
    }
    if (range2.start <= range1.start && range2.start + range2.length <= range1.start + range1.length) {
        return {
            intersection: { start: range1.start, length: range2.start + range2.length - range1.start },
            remainingRanges: [
                {
                    start: range2.start + range2.length,
                    length: range1.start + range1.length - range2.start - range2.length,
                },
            ],
        };
    }
}

function convertRanges(ranges, map) {
    const nonConvertedRanges = [...ranges];
    const convertedRanges = [];

    map.forEach((line) => {
        [...nonConvertedRanges].forEach((range) => {
            const { intersection, remainingRanges } = getIntersection(range, {
                start: line.startOrigin,
                length: line.length,
            });
            if (intersection) {
                const index = intersection.start - line.startOrigin;
                convertedRanges.push({
                    start: line.startDestination + index,
                    length: intersection.length,
                });
            }
            nonConvertedRanges.splice(nonConvertedRanges.indexOf(range), 1, ...remainingRanges);
        });
    });

    return [...convertedRanges, ...nonConvertedRanges];
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const [rawSeeds, ...rawMaps] = rawInput.split("\n\n");

    const rawSeedRanges = rawSeeds
        .replace("seeds: ", "")
        .split(" ")
        .map((n) => parseInt(n));

    const seedRanges = Array(rawSeedRanges.length / 2)
        .fill(null)
        .map((_, i) => ({
            start: rawSeedRanges[i * 2],
            length: rawSeedRanges[i * 2 + 1],
        }));

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

    const locationsRange = maps.reduce((ranges, map) => {
        return convertRanges(ranges, map);
    }, seedRanges);

    const result = Math.min(...locationsRange.map((range) => range.start));

    resolving.succeed(`Jour ${chalk.red(5)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
