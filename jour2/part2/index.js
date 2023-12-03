const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const games = rawInput.split("\n").map((line) => {
        const [, gameId, rawSubsets] = line.match(/^Game (\d+): (.*)$/) || [];

        const subsets = rawSubsets.split(";").map((subset) => {
            subset = subset.trim();
            const parts = subset.split(",").map((part) => part.trim());
            const result = { R: 0, G: 0, B: 0 };
            parts.forEach((part) => {
                const [, rCount] = part.match(/(\d+) red/) || [];
                if (rCount) {
                    result.R = parseInt(rCount);
                }
                const [, gCount] = part.match(/(\d+) green/) || [];
                if (gCount) {
                    result.G = parseInt(gCount);
                }
                const [, bCount] = part.match(/(\d+) blue/) || [];
                if (bCount) {
                    result.B = parseInt(bCount);
                }
            });

            return result;
        });

        return {
            gameId: parseInt(gameId),
            subsets,
        };
    });

    const powers = games.map((game) => {
        const maxR = Math.max(...game.subsets.map((subset) => subset.R));
        const maxG = Math.max(...game.subsets.map((subset) => subset.G));
        const maxB = Math.max(...game.subsets.map((subset) => subset.B));

        return maxR * maxG * maxB;
    });

    const result = powers.reduce((acc, power) => acc + power, 0);

    resolving.succeed(`Jour ${chalk.red(2)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
