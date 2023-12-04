const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function getCardPoints(card) {
    const nbWinningNumbers = card.numbers.filter((n) => card.winningNumbers.includes(n)).length;
    return nbWinningNumbers === 0 ? 0 : Math.pow(2, nbWinningNumbers - 1);
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const cards = rawInput.split("\n").map((line) => {
        const [_, cardNumber, rawWinning, rawNumbers] = line.match(/^Card\s+(\d+):\s+(.+)\s+\|\s+(.+)\s*$/);

        return {
            cardNumber: parseInt(cardNumber),
            winningNumbers: rawWinning.split(/\s+/).map((n) => parseInt(n)),
            numbers: rawNumbers.split(/\s+/).map((n) => parseInt(n)),
        };
    });

    const result = cards.reduce((acc, card) => {
        return acc + getCardPoints(card);
    }, 0);

    resolving.succeed(`Jour ${chalk.red(4)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
