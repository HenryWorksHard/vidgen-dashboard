'use client';

import { useEffect, useState } from 'react';

interface Generation {
  id: string;
  timestamp: string;
  character?: string;
  wardrobe?: string;
  environment?: string;
  prompt: string;
  imagePath?: string;
  videoPath?: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

export default function GalleryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');

  useEffect(() => {
    fetch('/api/generations')
      .then(res => res.json())
      .then(data => {
        setGenerations(data.generations || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredGenerations = generations.filter(gen => {
    if (filter === 'images') return gen.imagePath;
    if (filter === 'videos') return gen.videoPath;
    return true;
  });

  return (
    <div className="h-full">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <div>
          <h1 className="text-lg font-semibold">Gallery</h1>
          <p className="text-sm text-gray-500">View all generated content</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'images', 'videos'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg transition ${
                filter === f 
                  ? 'bg-[#2a2a2a] text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' && 'All'}
              {f === 'images' && '📸 Images'}
              {f === 'videos' && '🎬 Videos'}
            </button>
          ))}
        </div>
      </header>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin text-2xl">⏳</div>
          </div>
        ) : filteredGenerations.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
            <div className="text-4xl mb-3 opacity-50">🖼️</div>
            <h3 className="font-medium mb-2">No Generations Yet</h3>
            <p className="text-sm text-gray-400 mb-4">Use the Generation Flow to create your first video</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {filteredGenerations.map((gen) => (
              <div 
                key={gen.id} 
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition cursor-pointer"
              >
                <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center relative">
                  {gen.videoPath ? (
                    <video 
                      src={`/api/media?path=${encodeURIComponent(gen.videoPath)}`}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : gen.imagePath ? (
                    <img 
                      src={`/api/media?path=${encodeURIComponent(gen.imagePath)}`}
                      alt={gen.prompt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl opacity-30">
                      {gen.status === 'processing' ? '🔄' : '⏳'}
                    </span>
                  )}
                  
                  {gen.videoPath && (
                    <span className="absolute top-2 right-2 bg-red-600 px-2 py-0.5 rounded text-xs">
                      🎬
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex gap-1 mb-2">
                    {gen.character && (
                      <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-xs">
                        {gen.character}
                      </span>
                    )}
                    {gen.environment && (
                      <span className="bg-green-600/20 text-green-400 px-2 py-0.5 rounded text-xs">
                        {gen.environment}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{gen.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
