const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function getLength(startNode, nodes, endNodes, instructions) {
    return endNodes
        .map((endNode) => {
            let i = 0;
            let currentNode = startNode;
            const visited = {};
            while (currentNode !== endNode) {
                if (visited[currentNode] === i % instructions.length) {
                    return "loop";
                }
                visited[currentNode] = i % instructions.length;
                const instruction = instructions[i % instructions.length];
                currentNode = nodes.get(currentNode)[instruction];
                i++;
            }
            return i;
        })
        .filter((length) => length !== "loop");
}

const PRIMES = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109,
    113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239,
    241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379,
    383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521,
    523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661,
    673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827,
    829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991,
    997,
];
function getPrimes(number) {
    let remain = number;
    let result = {};
    while (remain > 1) {
        if (PRIMES.includes(remain)) {
            result[remain] = result[remain] ? result[remain] + 1 : 1;
            return result;
        }
        const prime = PRIMES.find((prime) => remain % prime === 0);
        remain /= prime;
        result[prime] = result[prime] ? result[prime] + 1 : 1;
    }

    return result;
}

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
            const [, id, L, R] = line.match(/(.+) = \((.+)\, (.+)\)/);
            nodes.set(id, { id, L, R });
        });

    instructions = [...instructions];
    let startNodes = [...nodes.keys()].filter((node) => node.endsWith("A"));
    let endNodes = [...nodes.keys()].filter((node) => node.endsWith("Z"));

    console.log(`Start nodes: ${startNodes}`, `End nodes: ${endNodes}`);

    const cycles = startNodes.map((startNode) => getLength(startNode, nodes, endNodes, instructions)).flat();

    const primes = cycles.map(getPrimes);
    const allPrimes = [...new Set(primes.map((prime) => Object.keys(prime)).flat())];

    const result = allPrimes.reduce((acc, prime) => {
        const max = Math.max(...primes.map((p) => p[prime] || 0));
        return acc * Math.pow(prime, max);
    }, 1);

    resolving.succeed(`Jour ${chalk.red(8)} - the answer is ${chalk.bold.magenta(result)}`);
    console.timeEnd("exec");
}

main();
