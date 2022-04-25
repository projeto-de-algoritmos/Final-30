import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom'
import G6 from "@antv/g6";

var PriorityQueue = require('js-priority-queue');

function knapSackRecursive(capacidadeTotal, items, itemsSize, bagItems = []) {
  if (itemsSize === 0 || capacidadeTotal === 0) return [0, bagItems];

  if (items[itemsSize - 1].weight > capacidadeTotal) return knapSackRecursive(capacidadeTotal, items, itemsSize - 1, bagItems)

  const use = knapSackRecursive(capacidadeTotal - items[itemsSize - 1].weight, items, itemsSize - 1, bagItems);
  const notUse = knapSackRecursive(capacidadeTotal, items, itemsSize - 1, bagItems);
  return (items[itemsSize - 1].value + use[0]) > notUse[0] ? [items[itemsSize - 1].value + use[0], [...use[1], items[itemsSize - 1].key]] : notUse;
}

const cidades = [
  'Nusco',
  'Dirath',
  'Galusma',
  'Dosi',
  'Krabor',
  'Shaomor',
  'Tulrid',
  'Megi'
]

const posicao = [
  {
    X: 43,
    Y: 45,
  },
  {
    X: 398,
    Y: 88,
  },
  {
    X: 256,
    Y: 175,
  },
  {
    X: 121,
    Y: 227,
  },
  {
    X: 210,
    Y: 331,
  },
  {
    X: 59,
    Y: 406,
  },
  {
    X: 424,
    Y:399,
  },
  {
    X: 415,
    Y: 292,
  }
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
const App = () => {

  const graphRef = useRef(null);
  const graph = useRef(null);

 

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

  const startDjikstra = () => {
    let [totalBag, goals] = knapSackRecursive(20, nodes, nodes.length);
    let startNode = nodes[0].key;
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

  

  useEffect(() => {

    const graphNodes = nodes.map((node, index) => ({
      ...node,
      x: posicao[index].X,
      y: posicao[index].Y,
      label: cidades[index],
      id: node.key.toString()
    }));

    const graphEdges = nodes
      .map((element, index) => {
        const arrAux = [];
        for (let i = 0; i < edges[index].length; i++) {
          if (edges[index][i] !== -1) {
            arrAux.push({
              source: element.key.toString(),
              target: nodes[i].key.toString()
            });
          }
        }
        return arrAux;
      })
      .flat();

    const graphData = {
      nodes: graphNodes,
      edges: graphEdges
    };
    if (!graph.current) {
      graph.current = new G6.Graph({
        container: ReactDOM.findDOMNode(graphRef.current),
        width: 500,
        height: 500,
        defaultNode: {
          type: 'node',
          labelCfg: {
            style: {
              fill: '#000000A6',
              fontSize: 10,
            },
          },
          style: {
            stroke: '#72CC4A',
            width: 150,
          },
        },
        defaultEdge: {
          style: {
            stroke: "#e2e2e2"
          }
        },
      });
    }
    graph.current.data(graphData);
    graph.current.render();
  }, []);

  return (
    <div>
      <button onClick={() => startDjikstra()}>iniciar </button>
      <div ref={graphRef} />
    </div>
  );
}

export default App;