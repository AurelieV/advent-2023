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

function getNext(line) {
    const sequences = getSequences(line);
    sequences[sequences.length - 1].push(0);
    for (let i = sequences.length - 2; i >= 0; i--) {
        const sequence = sequences[i];
        sequence.push(sequence.at(-1) + sequences[i + 1].at(-1));
    }

    return sequences[0].at(-1);
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const lines = rawInput.split("\n").map((line) => line.split(" ").map((n) => parseInt(n)));

    const result = lines.map(getNext).reduce((acc, n) => acc + n, 0);

    resolving.succeed(`Jour ${chalk.red(9)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
