'use client';

import { useState, useCallback } from 'react';

interface FlowNode {
  id: string;
  type: 'input' | 'scene' | 'video' | 'output';
  title: string;
  x: number;
  y: number;
  data?: {
    image?: string;
    label?: string;
    settings?: Record<string, string>;
  };
}

const initialNodes: FlowNode[] = [
  {
    id: 'input',
    type: 'input',
    title: 'Input',
    x: 80,
    y: 100,
    data: {
      label: 'Character Reference',
    },
  },
  {
    id: 'scene',
    type: 'scene',
    title: 'Scene input',
    x: 320,
    y: 250,
    data: {
      settings: {
        'Environment': 'tokyo-night',
        'Wardrobe': 'streetwear',
        'Style': 'cinematic',
      },
    },
  },
  {
    id: 'video',
    type: 'video',
    title: 'Video input',
    x: 600,
    y: 100,
    data: {
      label: 'Generated Image',
      settings: {
        'Motion': 'walking',
        'Duration': '5s',
      },
    },
  },
  {
    id: 'output',
    type: 'output',
    title: 'Output',
    x: 880,
    y: 250,
    data: {
      label: 'Final Video',
    },
  },
];

const connections = [
  { from: 'input', to: 'scene' },
  { from: 'scene', to: 'video' },
  { from: 'video', to: 'output' },
];

export default function FlowPage() {
  const [nodes] = useState<FlowNode[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  const getNodePosition = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x + 100, y: node.y + 60 } : { x: 0, y: 0 };
  }, [nodes]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <div>
          <h1 className="text-lg font-semibold">Generation Flow</h1>
          <p className="text-sm text-gray-500">Design your video generation pipeline</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a] transition">
            Load Template
          </button>
          <button className="px-4 py-2 text-sm bg-green-600 rounded-lg hover:bg-green-700 transition">
            Run Generation
          </button>
        </div>
      </header>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden bg-[#0a0a0a]">
        {/* Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="#333" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {connections.map((conn, i) => {
            const from = getNodePosition(conn.from);
            const to = getNodePosition(conn.to);
            const midX = (from.x + to.x) / 2;
            
            return (
              <g key={i}>
                <path
                  d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                  stroke="#444"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Animated dot */}
                <circle r="4" fill="#666">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden cursor-pointer transition-all hover:border-[#555] ${
              selectedNode?.id === node.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
            style={{
              left: node.x,
              top: node.y,
              width: 200,
              zIndex: 2,
            }}
            onClick={() => setSelectedNode(node)}
          >
            {/* Node Header */}
            <div className="px-3 py-2 bg-[#222] border-b border-[#333] flex items-center justify-between">
              <span className="text-xs font-medium text-gray-300">{node.title}</span>
              <div className="flex gap-1">
                <button className="w-5 h-5 rounded bg-[#333] hover:bg-[#444] flex items-center justify-center text-xs">
                  ⚙️
                </button>
              </div>
            </div>

            {/* Node Content */}
            <div className="p-3">
              {node.data?.image ? (
                <div className="aspect-square bg-[#2a2a2a] rounded-lg mb-2 flex items-center justify-center">
                  <img src={node.data.image} alt="" className="w-full h-full object-cover rounded-lg" />
                </div>
              ) : (
                <div className="aspect-square bg-[#2a2a2a] rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-3xl opacity-50">
                    {node.type === 'input' && '👤'}
                    {node.type === 'scene' && '📝'}
                    {node.type === 'video' && '🎬'}
                    {node.type === 'output' && '📹'}
                  </span>
                </div>
              )}

              {node.data?.label && (
                <p className="text-xs text-gray-400 text-center">{node.data.label}</p>
              )}

              {node.data?.settings && (
                <div className="mt-2 space-y-1">
                  {Object.entries(node.data.settings).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-500">{key}</span>
                      <span className="text-gray-300">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Connection Points */}
            <div className="absolute top-1/2 -left-2 w-4 h-4 bg-[#333] border-2 border-[#555] rounded-full transform -translate-y-1/2" />
            <div className="absolute top-1/2 -right-2 w-4 h-4 bg-[#333] border-2 border-[#555] rounded-full transform -translate-y-1/2" />
          </div>
        ))}

        {/* Toolbar */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#1a1a1a] border border-[#333] rounded-lg p-2 flex flex-col gap-2" style={{ zIndex: 10 }}>
          <button className="w-8 h-8 rounded bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-sm" title="Add Node">
            ➕
          </button>
          <button className="w-8 h-8 rounded bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-sm" title="Run">
            ▶️
          </button>
          <div className="border-t border-[#333] my-1" />
          <button className="w-8 h-8 rounded bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-sm" title="Edit">
            ✂️
          </button>
          <button className="w-8 h-8 rounded bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-sm" title="Draw">
            ✏️
          </button>
          <button className="w-8 h-8 rounded bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-sm" title="Comment">
            💬
          </button>
          <div className="border-t border-[#333] my-1" />
          <button className="w-8 h-8 rounded bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-sm" title="Undo">
            ↩️
          </button>
          <button className="w-8 h-8 rounded bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-sm" title="Redo">
            ↪️
          </button>
          <button className="w-8 h-8 rounded bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-sm" title="Settings">
            ⚙️
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2" style={{ zIndex: 10 }}>
          <span className="text-xs text-gray-400">100%</span>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedNode && (
        <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#141414] border-l border-[#2a2a2a] p-4 overflow-auto" style={{ marginTop: '65px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{selectedNode.title}</h3>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Node Type</label>
              <p className="text-sm capitalize">{selectedNode.type}</p>
            </div>

            {selectedNode.data?.settings && (
              <div>
                <label className="block text-xs text-gray-400 mb-2">Settings</label>
                <div className="space-y-2">
                  {Object.entries(selectedNode.data.settings).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-500 mb-1">{key}</label>
                      <input
                        type="text"
                        defaultValue={value}
                        className="w-full bg-[#2a2a2a] border border-[#333] rounded px-3 py-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
