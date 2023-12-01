const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const NUMBERS_LETTERS = {
        one: "1",
        two: "2",
        three: "3",
        four: "4",
        five: "5",
        six: "6",
        seven: "7",
        eight: "8",
        nine: "9",
        zero: "0",
    };
    const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    const result = rawInput.split("\n").reduce((sum, line) => {
        const numbers = [];

        while (line.length > 0) {
            if (DIGITS.includes(line[0])) {
                numbers.push(line[0]);
            } else {
                for (const [key, value] of Object.entries(NUMBERS_LETTERS)) {
                    if (line.startsWith(key)) {
                        numbers.push(value);
                        break;
                    }
                }
            }
            line = line.slice(1);
        }

        return sum + parseInt(`${numbers[0]}${numbers.at(-1)}`);
    }, 0);

    resolving.succeed(`Jour ${chalk.red(1)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
