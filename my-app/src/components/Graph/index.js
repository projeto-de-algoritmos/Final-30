import React, { useRef, useEffect, memo } from 'react';
import ReactDOM from 'react-dom'
import G6 from "@antv/g6";

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

function Graph() {
    const graph = useRef(null);
    const graphRef = useRef(null);

    useEffect(() => {

        const graphNodes = nodes.map((node, index) => ({
            ...node,
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
                width: 400,
                height: 400,

                defaultNode: {
                    type: 'node',
                    labelCfg: {
                        style: {
                            fill: '#000',
                            fontSize: 20,
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
                layout: {
                    type: "random",
                    width: 400,
                    height: 400
                }
            });
        }
        graph.current.data(graphData);
        graph.current.render();
    }, []);

    return (
        <>
            <div ref={graphRef} />
        </>
    )
}

export default Graph;