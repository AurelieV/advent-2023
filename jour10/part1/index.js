const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

const PIPES = {
    "|": ["N", "S"],
    "-": ["E", "W"],
    L: ["N", "E"],
    J: ["N", "W"],
    7: ["S", "W"],
    F: ["S", "E"],
    ".": [],
};

const OPPOSITE = {
    N: "S",
    S: "N",
    E: "W",
    W: "E",
};

function getVoisins(x, y) {
    return {
        N: [x, y - 1],
        S: [x, y + 1],
        E: [x + 1, y],
        W: [x - 1, y],
    };
}

function getFirsts(xs, ys, pipes) {
    const voisins = getVoisins(xs, ys);

    return Object.keys(voisins).reduce((acc, direction) => {
        const [x, y] = voisins[direction];
        const pipe = pipes.get(`${x},${y}`);
        if (pipe?.includes(OPPOSITE[direction])) {
            acc.push({
                next: pipe.find((x) => x !== OPPOSITE[direction]),
                coordinates: { x, y },
            });
        }
        return acc;
    }, []);
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const pipes = new Map();

    let start;
    rawInput.split("\n").forEach((line, y) => {
        line.split("").forEach((char, x) => {
            if (char === "S") {
                start = { x, y };
            } else {
                pipes.set(`${x},${y}`, PIPES[char]);
            }
        });
    });

    const visited = new Map();
    let nodes = getFirsts(start.x, start.y, pipes);

    function isDone() {
        return nodes.some((node) => visited.has(`${node.coordinates.x},${node.coordinates.y}`));
    }

    while (!isDone()) {
        nodes = nodes.map(({ coordinates, next }) => {
            visited.set(`${coordinates.x},${coordinates.y}`, OPPOSITE[next]);
            const [x, y] = getVoisins(coordinates.x, coordinates.y)[next];
            const pipe = pipes.get(`${x},${y}`);
            return {
                next: pipe.find((x) => x !== OPPOSITE[next]),
                coordinates: { x, y },
            };
        });
    }

    const result = Math.ceil(visited.size / 2);

    resolving.succeed(`Jour ${chalk.red(10)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
