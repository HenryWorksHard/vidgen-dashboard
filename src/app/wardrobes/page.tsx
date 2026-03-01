'use client';

import { useEffect, useState } from 'react';

interface Wardrobe {
  name: string;
  config?: {
    display_name?: string;
    description?: string;
    tags?: string[];
  };
}

export default function WardrobesPage() {
  const [wardrobes, setWardrobes] = useState<Wardrobe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/assets?type=wardrobes')
      .then(res => res.json())
      .then(data => {
        setWardrobes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-full">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <div>
          <h1 className="text-lg font-semibold">Wardrobes</h1>
          <p className="text-sm text-gray-500">Clothing and outfit configurations</p>
        </div>
        <button className="px-4 py-2 text-sm bg-green-600 rounded-lg hover:bg-green-700 transition">
          + Add Wardrobe
        </button>
      </header>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin text-2xl">⏳</div>
          </div>
        ) : wardrobes.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
            <div className="text-4xl mb-3 opacity-50">👔</div>
            <h3 className="font-medium mb-2">No Wardrobes Yet</h3>
            <p className="text-sm text-gray-400">Add outfit configurations to your skill</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {wardrobes.map((w) => (
              <div 
                key={w.name} 
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition cursor-pointer"
              >
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">👔</span>
                </div>
                <h3 className="font-medium text-sm capitalize">{w.config?.display_name || w.name}</h3>
                {w.config?.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{w.config.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
