const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

const POWER = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
};

const TYPE = {
    "High card": 1,
    "One pair": 2,
    "Two pair": 3,
    "Three of a kind": 4,
    "Full house": 5,
    "Four of a kind": 6,
    "Five of a kind": 7,
};

function getType(cards) {
    const nbOfEach = [...cards].reduce((acc, card) => {
        acc[card] = acc[card] ? acc[card] + 1 : 1;
        return acc;
    }, {});

    if (cards.length === Object.values(nbOfEach).length) {
        return TYPE["High card"];
    }
    if (Object.values(nbOfEach).includes(5)) {
        return TYPE["Five of a kind"];
    }
    if (Object.values(nbOfEach).includes(4)) {
        return TYPE["Four of a kind"];
    }
    if (Object.values(nbOfEach).includes(3)) {
        return Object.values(nbOfEach).includes(2) ? TYPE["Full house"] : TYPE["Three of a kind"];
    }
    if (Object.values(nbOfEach).includes(2)) {
        return Object.values(nbOfEach).filter((v) => v === 2).length === 2 ? TYPE["Two pair"] : TYPE["One pair"];
    }
}

function compareCards(cards1, cards2) {
    if (cards1.length === 0) return 0;
    if (cards1[0] === cards2[0]) {
        return compareCards(cards1.slice(1), cards2.slice(1));
    }
    return POWER[cards1[0]] > POWER[cards2[0]] ? 1 : -1;
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const hands = rawInput.split("\n").map((line) => {
        const [, cards, rawBid] = line.match(/^(.*)\s(\d+)$/);

        return {
            cards,
            bid: parseInt(rawBid),
            type: getType(cards),
        };
    });

    hands.sort((a, b) => {
        if (a.type === b.type) {
            return compareCards(a.cards.split(""), b.cards.split(""));
        }
        return a.type > b.type ? 1 : -1;
    });

    const result = hands.reduce((acc, hand, index) => acc + hand.bid * (index + 1), 0);

    resolving.succeed(`Jour ${chalk.red(7)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
