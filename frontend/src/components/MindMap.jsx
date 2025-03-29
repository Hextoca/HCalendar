import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import './MindMap.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: '中心节点' },
    position: { x: 250, y: 0 },
  },
];

const initialEdges = [];

const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(2);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = () => {
    const newNode = {
      id: `${nodeId}`,
      data: { label: `节点 ${nodeId}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeId((id) => id + 1);
  };

  const deleteNode = (nodeIdToDelete) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeIdToDelete));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete)
    );
  };

  return (
    <div className="mindmap-container">
      <div className="mindmap-controls">
        <button onClick={addNode}>添加节点</button>
        <button
          onClick={() => {
            if (nodes.length > 1) {
              deleteNode(nodes[nodes.length - 1].id);
            }
          }}
        >
          删除节点
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default MindMap;
