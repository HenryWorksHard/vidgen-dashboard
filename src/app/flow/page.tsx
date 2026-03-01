'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FlowNode {
  id: string;
  type: 'character' | 'wardrobe' | 'environment' | 'prompt' | 'image' | 'video';
  label: string;
  value?: string;
  preview?: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

export default function FlowPage() {
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: '1', type: 'character', label: 'Character', value: 'james', status: 'complete' },
    { id: '2', type: 'wardrobe', label: 'Wardrobe', value: 'streetwear', status: 'complete' },
    { id: '3', type: 'environment', label: 'Environment', value: 'tokyo-night', status: 'complete' },
    { id: '4', type: 'prompt', label: 'Prompt', value: 'walking through neon crowds, confident stride', status: 'complete' },
    { id: '5', type: 'image', label: 'Image Output', status: 'pending' },
    { id: '6', type: 'video', label: 'Video Output', status: 'pending' },
  ]);

  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  const getNodeColor = (type: FlowNode['type']) => {
    switch (type) {
      case 'character': return 'bg-blue-600 border-blue-400';
      case 'wardrobe': return 'bg-purple-600 border-purple-400';
      case 'environment': return 'bg-green-600 border-green-400';
      case 'prompt': return 'bg-yellow-600 border-yellow-400';
      case 'image': return 'bg-orange-600 border-orange-400';
      case 'video': return 'bg-red-600 border-red-400';
    }
  };

  const getNodeIcon = (type: FlowNode['type']) => {
    switch (type) {
      case 'character': return '👤';
      case 'wardrobe': return '👔';
      case 'environment': return '🌍';
      case 'prompt': return '📝';
      case 'image': return '📸';
      case 'video': return '🎬';
    }
  };

  const getStatusIndicator = (status: FlowNode['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'complete': return '✅';
      case 'error': return '❌';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white">← Back</Link>
            <h1 className="text-2xl font-bold">🔀 Generation Flow</h1>
          </div>
          <div className="flex gap-4">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
              Load Generation
            </button>
            <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
              Run Flow
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Flow Canvas */}
        <div className="bg-gray-800 rounded-lg p-8 min-h-[600px] relative overflow-hidden">
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Flow Nodes */}
          <div className="relative flex items-center justify-center gap-4 flex-wrap">
            {nodes.map((node, index) => (
              <div key={node.id} className="flex items-center">
                {/* Node */}
                <div 
                  className={`
                    ${getNodeColor(node.type)} 
                    border-2 rounded-lg p-4 min-w-[160px] cursor-pointer
                    transform transition hover:scale-105 hover:shadow-xl
                    ${selectedNode?.id === node.id ? 'ring-4 ring-white' : ''}
                  `}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{getNodeIcon(node.type)}</span>
                    <span>{getStatusIndicator(node.status)}</span>
                  </div>
                  <h3 className="font-semibold">{node.label}</h3>
                  {node.value && (
                    <p className="text-sm opacity-80 mt-1 truncate">{node.value}</p>
                  )}
                </div>

                {/* Connector Arrow */}
                {index < nodes.length - 1 && (
                  <div className="mx-4 text-gray-500 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>

          {/* Connection Lines (SVG overlay) */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
            {/* Add bezier curves between nodes if needed */}
          </svg>
        </div>

        {/* Node Details Panel */}
        {selectedNode && (
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-2xl">{getNodeIcon(selectedNode.type)}</span>
                {selectedNode.label}
              </h2>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setSelectedNode(null)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Type</label>
                <p className="capitalize">{selectedNode.type}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <p className="flex items-center gap-2">
                  {getStatusIndicator(selectedNode.status)}
                  <span className="capitalize">{selectedNode.status}</span>
                </p>
              </div>
              {selectedNode.value && (
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Value</label>
                  <p className="bg-gray-900 p-3 rounded">{selectedNode.value}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generation History */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Generations</h2>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400">No generation history yet.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
