'use client';

import React, { useState, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A' }, style: { background: '#ddd' } },
  { id: 'B', position: { x: 200, y: 0 }, data: { label: 'B' }, style: { background: '#ddd' } },
  { id: 'C', position: { x: 400, y: 0 }, data: { label: 'C' }, style: { background: '#ddd' } },
  { id: 'D', position: { x: 100, y: 150 }, data: { label: 'D' }, style: { background: '#ddd' } },
  { id: 'E', position: { x: 300, y: 150 }, data: { label: 'E' }, style: { background: '#ddd' } },
];

const initialEdges = [
  { id: 'e1', source: 'A', target: 'B' },
  { id: 'e2', source: 'A', target: 'C' },
  { id: 'e3', source: 'B', target: 'D' },
  { id: 'e4', source: 'C', target: 'E' },
];

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [visited, setVisited] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const bfsTraversal = async (startNodeId) => {
    setIsRunning(true);
    setVisited([]);

    const queue = [startNodeId];
    const visitedSet = new Set([startNodeId]);

    while (queue.length > 0) {
      const currentNodeId = queue.shift();
      setVisited((prev) => [...prev, currentNodeId]);

      setNodes((nds) =>
        nds.map((node) =>
          node.id === currentNodeId
            ? { ...node, style: { background: '#34d399', color: '#000' } } // green
            : node
        )
      );

      await new Promise((res) => setTimeout(res, 1000));

      const neighbors = edges
        .filter((edge) => edge.source === currentNodeId)
        .map((edge) => edge.target);

      neighbors.forEach((neighborId) => {
        if (!visitedSet.has(neighborId)) {
          queue.push(neighborId);
          visitedSet.add(neighborId);
        }
      });
    }

    setIsRunning(false);
  };

  const resetGraph = () => {
    setVisited([]);
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        style: { background: '#ddd', color: '#000' },
      }))
    );
  };

  return (
    <div className="h-screen w-screen p-4 bg-slate-100">
      <h1 className="text-3xl font-bold mb-4">React Flow BFS Visualizer</h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => bfsTraversal('A')}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Start BFS from A
        </button>
        <button
          onClick={resetGraph}
          disabled={isRunning}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Reset
        </button>
      </div>

      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      <div className="mt-4">
        <strong>Visited Order:</strong> {visited.join(' → ')}
      </div>
    </div>
  );
}
