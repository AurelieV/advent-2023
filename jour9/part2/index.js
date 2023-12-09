const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function getSequences(line) {
    const sequences = [line];
    let sequence = line;
    while (sequence.some((n) => n !== 0)) {
        sequence = sequence
            .map((value, index) => (index === sequence.length - 1 ? null : sequence[index + 1] - value))
            .slice(0, -1);
        sequences.push(sequence);
    }
    return sequences;
}

function getPrevious(line) {
    const sequences = getSequences(line);
    sequences[sequences.length - 1].unshift(0);
    for (let i = sequences.length - 2; i >= 0; i--) {
        const sequence = sequences[i];
        sequence.unshift(sequence.at(0) - sequences[i + 1].at(0));
    }

    return sequences[0].at(0);
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const lines = rawInput.split("\n").map((line) => line.split(" ").map((n) => parseInt(n)));

    const result = lines.map(getPrevious).reduce((acc, n) => acc + n, 0);

    resolving.succeed(`Jour ${chalk.red(9)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
