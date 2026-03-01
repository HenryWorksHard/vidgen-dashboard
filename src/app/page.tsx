'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">AI Video Generation</p>
        </div>
        <button className="px-4 py-2 text-sm bg-green-600 rounded-lg hover:bg-green-700 transition">
          + New Generation
        </button>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Link 
            href="/flow"
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition group"
          >
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-600/30 transition">
              <span className="text-lg">🔀</span>
            </div>
            <h3 className="font-medium text-sm mb-1">Generation Flow</h3>
            <p className="text-xs text-gray-500">Design your pipeline</p>
          </Link>

          <Link 
            href="/characters"
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition group"
          >
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600/30 transition">
              <span className="text-lg">👤</span>
            </div>
            <h3 className="font-medium text-sm mb-1">Characters</h3>
            <p className="text-xs text-gray-500">Manage face refs</p>
          </Link>

          <Link 
            href="/wardrobes"
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition group"
          >
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-600/30 transition">
              <span className="text-lg">👔</span>
            </div>
            <h3 className="font-medium text-sm mb-1">Wardrobes</h3>
            <p className="text-xs text-gray-500">Outfit configs</p>
          </Link>

          <Link 
            href="/gallery"
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition group"
          >
            <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-600/30 transition">
              <span className="text-lg">🖼️</span>
            </div>
            <h3 className="font-medium text-sm mb-1">Gallery</h3>
            <p className="text-xs text-gray-500">View outputs</p>
          </Link>
        </div>

        {/* Recent Generations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Recent Generations</h2>
            <Link href="/gallery" className="text-sm text-gray-400 hover:text-white">
              View all →
            </Link>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="text-center py-8">
              <div className="text-4xl mb-3 opacity-50">🎬</div>
              <p className="text-sm text-gray-400 mb-4">No generations yet</p>
              <Link 
                href="/flow"
                className="inline-block px-4 py-2 text-sm bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a] transition"
              >
                Create your first video
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-2xl font-semibold">0</p>
            <p className="text-xs text-gray-500 mt-1">Total Generations</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-2xl font-semibold">1</p>
            <p className="text-xs text-gray-500 mt-1">Characters</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-2xl font-semibold">1</p>
            <p className="text-xs text-gray-500 mt-1">Wardrobes</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-2xl font-semibold">1</p>
            <p className="text-xs text-gray-500 mt-1">Environments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
