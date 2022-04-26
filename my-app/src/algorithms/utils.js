const PriorityQueue = require('js-priority-queue');

export const cidades = [
    'Nusco',
    'Dirath',
    'Galusma',
    'Dosi',
    'Krabor',
    'Shaomor',
    'Tulrid',
    'Megi'
]

const edges = [
    [-1, 9, -1, -1, -1, 14, 15, -1],
    [9, -1, 23, -1, -1, -1, -1, -1],
    [-1, 23, -1, 6, 2, -1, -1, 19],
    [-1, -1, 6, -1, 11, -1, -1, 6],
    [-1, -1, 2, 11, -1, 30, 30, 16],
    [14, -1, -1, -1, 30, -1, 5, 18],
    [15, -1, -1, -1, 30, 5, -1, 44],
    [-1, -1, 19, 6, 16, 18, 44, -1]
];
const nodes = [
    { key: 0, weight: 5, value: 1 },
    { key: 1, weight: 12, value: 55 },
    { key: 2, weight: 18, value: 47 },
    { key: 3, weight: 20, value: 89 },
    { key: 4, weight: 1, value: 63 },
    { key: 5, weight: 7, value: 44 },
    { key: 6, weight: 19, value: 23 },
    { key: 7, weight: 16, value: 51 }
];

function knapSackRecursive(capacidadeTotal, items, itemsSize, bagItems = []) {
    if (itemsSize === 0 || capacidadeTotal === 0) return [0, bagItems];

    if (items[itemsSize - 1].weight > capacidadeTotal) return knapSackRecursive(capacidadeTotal, items, itemsSize - 1, bagItems)

    const use = knapSackRecursive(capacidadeTotal - items[itemsSize - 1].weight, items, itemsSize - 1, bagItems);
    const notUse = knapSackRecursive(capacidadeTotal, items, itemsSize - 1, bagItems);
    return (items[itemsSize - 1].value + use[0]) > notUse[0] ? [items[itemsSize - 1].value + use[0], [...use[1], items[itemsSize - 1].key]] : notUse;
}


const shortPath = (startPath, endPath) => {
    const queueList = new PriorityQueue({ comparator: (a, b) => { return a[0] - b[0] } });
    const definitiveMap = new Map();
    const auxMap = new Map();

    let visited = {};

    let currentNode = startPath;
    definitiveMap.set(currentNode, [0, 0]);
    visited[startPath] = true;

    do {
        edges[currentNode]?.forEach((edge, index) => {
            if (edge === -1) {
                return;
            }
            let currentWeight = edge + definitiveMap.get(currentNode)[0];

            if (!(auxMap.has(index) && currentWeight >= auxMap.get(index)[0]) && !definitiveMap.has(index)) {
                queueList.queue([currentWeight, index, currentNode]);
                auxMap.set(index, [currentWeight, currentNode]);
            };
        });
        if (!queueList.length) break;
        let nextStep = queueList.dequeue();
        while (queueList.length && definitiveMap.has(nextStep[1])) {
            nextStep = queueList.dequeue();
        }

        definitiveMap.set(nextStep[1], [nextStep[0], nextStep[2]]);
        currentNode = nextStep[1];
        visited[currentNode] = true;
    } while (!visited[endPath]);

    let path = [];
    let aux = endPath;
    while (aux !== startPath) {
        const pathStart = definitiveMap.get(aux)?.[1];
        path.push(aux);
        aux = pathStart;
    }

    return [[...path, startPath].reverse(), definitiveMap.get(endPath)?.[0]];
}

export const knapSackLimitedPathSimple = (pathLimit, bagLimit, current, visited = {}, totalCurrentPath = 0, totalCurrentBag = 0, bagValue = 0, bagItems = [], currentPath = []) => {
    visited[current] = true;
    let maxValue = [bagValue, totalCurrentPath, totalCurrentBag, bagItems, currentPath];
    if(nodes.length === Object.keys(visited).length) return maxValue;
    edges[current].forEach((edge,index) => {
      if(edge === -1) return;
      if(visited[index]) return;
      if(totalCurrentPath + edge <= pathLimit) {
        let currentValue;
        const notUse = knapSackLimitedPathSimple(pathLimit, bagLimit, index, JSON.parse(JSON.stringify(visited)), totalCurrentPath + edge, totalCurrentBag, bagValue, bagItems, [...currentPath, index]);
        if(totalCurrentBag + nodes[index].weight <= bagLimit) {
          const use = knapSackLimitedPathSimple(pathLimit, bagLimit, index, JSON.parse(JSON.stringify(visited)), totalCurrentPath + edge, totalCurrentBag + nodes[index].weight, bagValue + nodes[index].value, [...bagItems, nodes[index].key], [...currentPath, index]);
          currentValue = use[0] > notUse[0] ? use : notUse;
        } else {
          currentValue = notUse;
        }
        if(currentValue[0] > maxValue[0]){
          maxValue = currentValue;
        }
      }
    });
    return maxValue;
  }

export const startDjikstra = ({ initialNode, bagWeight }) => {
    let [totalBag, goals] = knapSackRecursive(bagWeight, nodes, nodes.length);
    let startNode = initialNode;
    let finalPath = [0];
    let finalLength = 0;
    let L1 = [];

    while (goals.length) {
        for (let i = 0; i < goals.length; i++) {
            const [nodes_path, totalNode] = shortPath(startNode, goals[i]);
            L1[i] = [goals[i], totalNode, nodes_path.slice(1)];
        }
        L1.sort((a, b) => {
            if (a[1] > b[1]) return 1;

            if (a[1] < b[1]) return -1;

            return 0;
        });
        let e_Dest_Node = L1[0][0];
        finalLength += L1[0][1];
        finalPath.push(L1[0][2]);

        startNode = e_Dest_Node;
        goals = goals.filter(goal => startNode !== goal);
        L1 = [];
    }
    console.log({ finalLength, finalPath: finalPath.flat(), totalBag })
    return { finalLength, finalPath: finalPath.flat(), totalBag };
};