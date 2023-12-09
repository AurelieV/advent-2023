const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const nodes = new Map();
    let [instructions, lines] = rawInput.split("\n\n");
    lines
        .split("\n")
        .slice()
        .forEach((line) => {
            const [, id, L, R] = line.match(/([A-Z]+) = \(([A-Z]+)\, ([A-Z]+)\)/);
            nodes.set(id, { id, L, R });
        });

    instructions = [...instructions];
    let currentNode = "AAA";
    let i = 0;
    while (currentNode !== "ZZZ") {
        const instruction = instructions[i % instructions.length];
        currentNode = nodes.get(currentNode)[instruction];
        i++;
    }

    resolving.succeed(`Jour ${chalk.red(8)} - the answer is ${chalk.bold.magenta(i)}`);
    console.timeEnd("exec");
}

main();
