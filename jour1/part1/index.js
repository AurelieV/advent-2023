const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const result = rawInput.split("\n").reduce((sum, line) => {
        const numbers = line
            .split("")
            .filter((char) => ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(char));
        return sum + parseInt(`${numbers[0]}${numbers.at(-1)}`);
    }, 0);

    resolving.succeed(`Jour ${chalk.red(1)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
