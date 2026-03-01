'use client';

import { useEffect, useState } from 'react';

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
    <div className="h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <div>
          <h1 className="text-lg font-semibold">Characters</h1>
          <p className="text-sm text-gray-500">Manage character models with face references</p>
        </div>
        <button className="px-4 py-2 text-sm bg-green-600 rounded-lg hover:bg-green-700 transition">
          + Add Character
        </button>
      </header>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin text-2xl">⏳</div>
          </div>
        ) : characters.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
            <div className="text-4xl mb-3 opacity-50">👤</div>
            <h3 className="font-medium mb-2">No Characters Yet</h3>
            <p className="text-sm text-gray-400 mb-4">Add face reference images to create your first character</p>
            <code className="block bg-[#0a0a0a] px-4 py-3 rounded-lg text-xs text-green-400 font-mono">
              mkdir -p ~/clawd/skills/vidgen/models/[name]/reference
            </code>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {characters.map((char) => (
              <div 
                key={char.name} 
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition cursor-pointer"
              >
                <div className="aspect-square bg-[#0a0a0a] flex items-center justify-center">
                  {char.thumbnail ? (
                    <img 
                      src={char.thumbnail} 
                      alt={char.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl opacity-30">👤</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm capitalize">{char.config?.display_name || char.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {char.references?.length || 0} references
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
