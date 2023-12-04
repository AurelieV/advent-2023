const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function computeValue(cardNumber, cards) {
    const card = cards.get(cardNumber);
    const nbOfWinningNumbers = card.numbers.filter((n) => card.winningNumbers.includes(n)).length;

    let value = 1;
    for (let i = 1; i <= nbOfWinningNumbers; i++) {
        if (cards.has(cardNumber + i)) {
            const nextCard = cards.get(cardNumber + i);
            if (nextCard.value === -1) {
                throw new Error("This should not happen");
            } else {
                value += nextCard.value;
            }
        }
    }
    card.value = value;
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const cards = new Map();

    rawInput.split("\n").forEach((line) => {
        const [_, cardNumber, rawWinning, rawNumbers] = line.match(/^Card\s+(\d+):\s+(.+)\s+\|\s+(.+)\s*$/);

        cards.set(parseInt(cardNumber), {
            cardNumber: parseInt(cardNumber),
            winningNumbers: rawWinning.split(/\s+/).map((n) => parseInt(n)),
            numbers: rawNumbers.split(/\s+/).map((n) => parseInt(n)),
            value: -1,
        });
    });

    for (let i = 0; i < cards.size; i++) {
        computeValue(cards.size - i, cards);
    }

    const result = [...cards.values()].map((card) => card.value).reduce((acc, value) => acc + value, 0);

    resolving.succeed(`Jour ${chalk.red(4)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
