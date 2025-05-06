import React from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { buildGenealogyGraph } from './genealogyUtils';
import './GenealogyTree.scss';
import { PersonNode } from './PersonNode';

interface GenealogyTreeProps {
  data: any;
  unlocked: boolean;
}

export const GenealogyTree: React.FC<GenealogyTreeProps> = ({ data, unlocked }) => {
  const { nodes, edges } = buildGenealogyGraph(data, unlocked);
  return (
    <div className="genealogy-tree">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        fitView
        nodeTypes={{ default: PersonNode }}
      >
        <Background color="#222" gap={16} />
        <Controls showZoom={true} showFitView={true} showInteractive={false} />
      </ReactFlow>
    </div>
  );
}; 