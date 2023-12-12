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

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test4.txt"), "utf-8");
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

    const maxX = rawInput.split("\n")[0].length - 1;
    const maxY = rawInput.split("\n").length - 1;
    const loopPipes = getLoop(pipes, start, maxX, maxY);

    const { visited: outsideNodes } = markOutsideLoopNodes(pipes, loopPipes, maxX, maxY);
    const result = [...pipes.keys()].filter((key) => !outsideNodes.has(key) && !loopPipes.has(key)).length;

    // console.log("RESULT");

    // let finalGrid = "";
    // for (let y = 0; y <= maxY; y++) {
    //     for (let x = 0; x <= maxX; x++) {
    //         if (loopPipes.has(`${x},${y}`)) {
    //             finalGrid += chalk.bgRed("P");
    //         } else if (outsideNodes.has(`${x},${y}`)) {
    //             finalGrid += starter.includes(`${x},${y}`) ? chalk.bgYellow("O") : chalk.bgBlue("O");
    //         } else {
    //             finalGrid += chalk.bgGreen("I");
    //         }
    //     }
    //     finalGrid += "\n";
    // }

    // console.log(finalGrid);

    resolving.succeed(`Jour ${chalk.red(10)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

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

function getLoop(pipes, start) {
    const loopPipes = new Map();

    let nodes = getFirsts(start.x, start.y, pipes);
    loopPipes.set(`${start.x},${start.y}`, "S");
    pipes.set(
        `${start.x},${start.y}`,
        nodes.map(
            ({ next, coordinates }) => OPPOSITE[pipes.get(`${coordinates.x},${coordinates.y}`).find((x) => x !== next)]
        )
    );

    function isDone() {
        return nodes.some((node) => loopPipes.has(`${node.coordinates.x},${node.coordinates.y}`));
    }

    while (!isDone()) {
        nodes = nodes.map(({ coordinates, next }) => {
            loopPipes.set(`${coordinates.x},${coordinates.y}`, 0);
            const [x, y] = getVoisins(coordinates.x, coordinates.y)[next];
            const pipe = pipes.get(`${x},${y}`);
            return {
                next: pipe.find((x) => x !== OPPOSITE[next]),
                coordinates: { x, y },
            };
        });
    }

    return loopPipes;
}

function markOutsideLoopNodes(pipes, loopPipes, maxX, maxY) {
    const visited = new Map();
    let toExplore = [];

    const loopMaxY = Math.max(...[...loopPipes.keys()].map((key) => parseFloat(key.split(",")[1])));
    const loopMinY = Math.min(...[...loopPipes.keys()].map((key) => parseFloat(key.split(",")[1])));

    const demiGrid = getDemiGrid(maxX, maxY, loopPipes, pipes);

    for (let y = 0; y <= maxY; y++) {
        const lineLoop = [...loopPipes.keys()].filter((key) => {
            const [px, py] = key.split(",").map((n) => parseFloat(n));
            return y === py;
        });
        const localMinX = Math.min(...lineLoop.map((key) => parseFloat(key.split(",")[0])));
        const localMaxX = Math.max(...lineLoop.map((key) => parseFloat(key.split(",")[0])));
        for (let x = 0; x <= maxX; x++) {
            if (y < loopMinY || y > loopMaxY) {
                toExplore.push({ x, y });
                visited.set(`${x},${y}`, 0);
            } else if (y === loopMinY || y === loopMaxY) {
                if (!loopPipes.has(`${x},${y}`)) {
                    toExplore.push({ x, y });
                    visited.set(`${x},${y}`, 0);
                }
            } else {
                if (x < localMinX || x > localMaxX) {
                    toExplore.push({ x, y });
                    visited.set(`${x},${y}`, 0);
                }
            }
        }
    }

    const starter = toExplore.map(({ x, y }) => `${x},${y}`);

    // console.log("RESULT");

    // let finalGrid = "";
    // for (let y = 0; y <= maxY; y = y + 0.5) {
    //     for (let x = 0; x <= maxX; x = x + 0.5) {
    //         if (demiGrid.get(`${x},${y}`) === "p") {
    //             finalGrid += chalk.bgRed("P");
    //         } else if (visited.has(`${x},${y}`)) {
    //             finalGrid += toExplore.map(({ x, y }) => `${x},${y}`).includes(`${x},${y}`)
    //                 ? chalk.bgYellow("O")
    //                 : chalk.bgBlue("O");
    //         } else {
    //             finalGrid += chalk.bgWhite(" ");
    //         }
    //     }
    //     finalGrid += "\n";
    // }

    // console.log(finalGrid);

    console.log(`Starting with ${toExplore.length} nodes to explore`);
    console.log(`Total nodes: ${demiGrid.size} (2*${maxX + 1}*${maxY + 1})`);

    while (toExplore.length > 0) {
        const { x, y } = toExplore.shift();
        const nextToExplore = getNextToExplore(x, y, visited, demiGrid);
        nextToExplore.forEach(({ x, y }) => visited.set(`${x},${y}`, 0));
        toExplore.push(...nextToExplore);
        console.log(`Pushing ${nextToExplore.length} nodes => ${toExplore.length} nodes to explore`);
    }

    return { visited, starter, demiGrid };
}

function getDemiGrid(maxX, maxY, loopPipes, pipes) {
    const demiGrid = new Map();

    for (let y = 0; y <= maxY; y = y + 0.5) {
        for (let x = 0; x <= maxX; x = x + 0.5) {
            if (loopPipes.has(`${x},${y}`)) {
                demiGrid.set(`${x},${y}`, "p");
            } else if (Math.floor(x) === x && Math.floor(y) === y) {
                demiGrid.set(`${x},${y}`, ".");
            } else if (Math.floor(x) === x) {
                const isConnected =
                    loopPipes.has(`${x},${y - 0.5}`) &&
                    loopPipes.has(`${x},${y + 0.5}`) &&
                    pipes.get(`${x},${y - 0.5}`)?.includes("S") &&
                    pipes.get(`${x},${y + 0.5}`)?.includes("N");
                demiGrid.set(`${x},${y}`, isConnected ? "p" : ".");
            } else if (Math.floor(y) === y) {
                const isConnected =
                    loopPipes.has(`${x - 0.5},${y}`) &&
                    loopPipes.has(`${x + 0.5},${y}`) &&
                    pipes.get(`${x - 0.5},${y}`)?.includes("E") &&
                    pipes.get(`${x + 0.5},${y}`)?.includes("W");
                demiGrid.set(`${x},${y}`, isConnected ? "p" : ".");
            } else {
                demiGrid.set(`${x},${y}`, ".");
            }
        }
    }
    return demiGrid;
}

function getNextToExplore(x, y, visited, demiGrid) {
    const nextToExplore = [];
    const voisins = getDemiVoisins(x, y);

    Object.keys(voisins).forEach((direction) => {
        const [vx, vy] = voisins[direction];
        const key = `${vx},${vy}`;
        if (!visited.has(key) && demiGrid.has(key) && demiGrid.get(key) !== "p") {
            nextToExplore.push({ x: vx, y: vy });
        }
    });

    return nextToExplore;
}

function getDemiVoisins(x, y) {
    return {
        N: [x, y - 0.5],
        S: [x, y + 0.5],
        E: [x + 0.5, y],
        W: [x - 0.5, y],
    };
}

main();
