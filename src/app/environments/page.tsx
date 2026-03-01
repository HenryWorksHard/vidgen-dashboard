'use client';

import { useEffect, useState } from 'react';

interface Environment {
  name: string;
  config?: {
    display_name?: string;
    setting?: string;
    lighting?: string;
    atmosphere?: string;
  };
}

export default function EnvironmentsPage() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/assets?type=environments')
      .then(res => res.json())
      .then(data => {
        setEnvironments(data);
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
          <h1 className="text-lg font-semibold">Environments</h1>
          <p className="text-sm text-gray-500">Scene locations and settings</p>
        </div>
        <button className="px-4 py-2 text-sm bg-green-600 rounded-lg hover:bg-green-700 transition">
          + Add Environment
        </button>
      </header>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin text-2xl">⏳</div>
          </div>
        ) : environments.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
            <div className="text-4xl mb-3 opacity-50">🌍</div>
            <h3 className="font-medium mb-2">No Environments Yet</h3>
            <p className="text-sm text-gray-400">Add scene configurations to your skill</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {environments.map((env) => (
              <div 
                key={env.name} 
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition cursor-pointer"
              >
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">🌍</span>
                </div>
                <h3 className="font-medium text-sm capitalize">{env.config?.display_name || env.name}</h3>
                {env.config?.setting && (
                  <p className="text-xs text-gray-500 mt-1">{env.config.setting}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
