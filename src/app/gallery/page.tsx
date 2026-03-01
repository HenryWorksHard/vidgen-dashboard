'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white">← Back</Link>
            <h1 className="text-2xl font-bold">🖼️ Gallery</h1>
          </div>
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 rounded ${filter === 'images' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setFilter('images')}
            >
              📸 Images
            </button>
            <button 
              className={`px-4 py-2 rounded ${filter === 'videos' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setFilter('videos')}
            >
              🎬 Videos
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl">⏳</div>
            <p className="mt-4 text-gray-400">Loading gallery...</p>
          </div>
        ) : filteredGenerations.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <div className="text-6xl mb-4">🖼️</div>
            <h2 className="text-xl font-semibold mb-2">No Generations Yet</h2>
            <p className="text-gray-400 mb-4">Generate your first video using the VidGen skill</p>
            <code className="block bg-gray-900 p-3 rounded text-sm text-green-400">
              ./vidgen.sh "james in tokyo-night wearing streetwear, walking through crowds"
            </code>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGenerations.map((gen) => (
              <div key={gen.id} className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition">
                {/* Media Preview */}
                <div className="aspect-video bg-gray-700 flex items-center justify-center relative">
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
                    <span className="text-4xl">
                      {gen.status === 'processing' ? '🔄' : '⏳'}
                    </span>
                  )}
                  
                  {/* Type Badge */}
                  <div className="absolute top-2 right-2">
                    {gen.videoPath && (
                      <span className="bg-red-600 px-2 py-1 rounded text-xs">🎬 Video</span>
                    )}
                    {gen.imagePath && !gen.videoPath && (
                      <span className="bg-orange-600 px-2 py-1 rounded text-xs">📸 Image</span>
                    )}
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <div className="flex gap-2 mb-2">
                    {gen.character && (
                      <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs">
                        {gen.character}
                      </span>
                    )}
                    {gen.environment && (
                      <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-xs">
                        {gen.environment}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{gen.prompt}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(gen.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
