'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Character {
  name: string;
  config?: {
    display_name?: string;
    description?: Record<string, unknown>;
  };
  references?: string[];
  thumbnail?: string;
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/assets?type=models')
      .then(res => res.json())
      .then(data => {
        setCharacters(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white">← Back</Link>
            <h1 className="text-2xl font-bold">👤 Characters</h1>
          </div>
          <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
            + New Character
          </button>
        </div>
      </header>

      <main className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl">⏳</div>
            <p className="mt-4 text-gray-400">Loading characters...</p>
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-xl font-semibold mb-2">No Characters Yet</h2>
            <p className="text-gray-400 mb-4">Add face reference images to create your first character</p>
            <code className="block bg-gray-900 p-3 rounded text-sm text-green-400">
              mkdir -p ~/clawd/skills/vidgen/models/[name]/reference
            </code>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((char) => (
              <div key={char.name} className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition">
                {/* Thumbnail */}
                <div className="aspect-square bg-gray-700 flex items-center justify-center">
                  {char.thumbnail ? (
                    <img 
                      src={char.thumbnail} 
                      alt={char.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">👤</span>
                  )}
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold capitalize">{char.config?.display_name || char.name}</h3>
                  <p className="text-sm text-gray-400">
                    {char.references?.length || 0} reference images
                  </p>
                  {char.config?.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {typeof char.config.description === 'object' 
                        ? JSON.stringify(char.config.description).slice(0, 100)
                        : String(char.config.description).slice(0, 100)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
