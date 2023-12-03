const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function isPartNext(part, symbolKey) {
    if (part.y > 0) {
        for (let x = Math.max(part.start - 1, 0); x <= part.end + 1; x++) {
            if (symbolKey === `${x},${part.y - 1}`) {
                return true;
            }
        }
    }
    for (let x = Math.max(part.start - 1, 0); x <= part.end + 1; x++) {
        if (symbolKey === `${x},${part.y + 1}`) {
            return true;
        }
    }
    if (part.start > 0) {
        if (symbolKey === `${part.start - 1},${part.y}`) {
            return true;
        }
    }
    return symbolKey === `${part.end + 1},${part.y}`;
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const parts = [];
    const symbols = {};

    rawInput.split("\n").forEach((line, y) => {
        let start = -1;
        let numbers = "";
        [...line].forEach((char, x) => {
            if (char.match(/\d/)) {
                numbers += char;
                if (start === -1) {
                    start = x;
                }
            } else {
                if (numbers.length > 0) {
                    parts.push({
                        start,
                        end: x - 1,
                        y,
                        numbers: parseInt(numbers),
                    });
                    numbers = "";
                    start = -1;
                }
                if (char !== ".") {
                    symbols[`${x},${y}`] = char;
                }
            }
        });
        if (numbers.length > 0) {
            parts.push({
                start,
                end: line.length - 1,
                y,
                numbers: parseInt(numbers),
            });
        }
    });

    const result = Object.entries(symbols).reduce((acc, [symbolKey, symbol]) => {
        if (symbol === "*") {
            const nearParts = parts.filter((part) => isPartNext(part, symbolKey));
            if (nearParts.length === 2) {
                acc += nearParts[0].numbers * nearParts[1].numbers;
            }
        }
        return acc;
    }, 0);

    resolving.succeed(`Jour ${chalk.red(3)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
