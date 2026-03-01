'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">🎬 VidGen Dashboard</h1>
          <nav className="flex gap-6">
            <Link href="/gallery" className="hover:text-blue-400">Gallery</Link>
            <Link href="/characters" className="hover:text-blue-400">Characters</Link>
            <Link href="/wardrobes" className="hover:text-blue-400">Wardrobes</Link>
            <Link href="/environments" className="hover:text-blue-400">Environments</Link>
            <Link href="/flow" className="hover:text-blue-400">Flow View</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Characters Card */}
          <Link href="/characters" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition">
            <div className="text-4xl mb-4">👤</div>
            <h2 className="text-xl font-semibold mb-2">Characters</h2>
            <p className="text-gray-400">Manage character models with face references</p>
          </Link>

          {/* Wardrobes Card */}
          <Link href="/wardrobes" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition">
            <div className="text-4xl mb-4">👔</div>
            <h2 className="text-xl font-semibold mb-2">Wardrobes</h2>
            <p className="text-gray-400">Clothing and outfit configurations</p>
          </Link>

          {/* Environments Card */}
          <Link href="/environments" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition">
            <div className="text-4xl mb-4">🌍</div>
            <h2 className="text-xl font-semibold mb-2">Environments</h2>
            <p className="text-gray-400">Scene locations and settings</p>
          </Link>

          {/* Gallery Card */}
          <Link href="/gallery" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition">
            <div className="text-4xl mb-4">🖼️</div>
            <h2 className="text-xl font-semibold mb-2">Gallery</h2>
            <p className="text-gray-400">View all generated images and videos</p>
          </Link>
        </div>

        {/* Recent Generations */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Recent Generations</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-400">No generations yet. Use the VidGen skill to create content!</p>
            <code className="block mt-4 bg-gray-900 p-3 rounded text-sm text-green-400">
              ./vidgen.sh "james in tokyo-night wearing streetwear, walks through neon crowds"
            </code>
          </div>
        </section>

        {/* Flow Preview */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Generation Flow</h2>
            <Link href="/flow" className="text-blue-400 hover:underline">View Full Flow →</Link>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-4 rounded-lg">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-purple-600 p-4 rounded-lg">
                  <span className="text-2xl">👔</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-green-600 p-4 rounded-lg">
                  <span className="text-2xl">🌍</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-orange-600 p-4 rounded-lg">
                  <span className="text-2xl">📸</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-red-600 p-4 rounded-lg">
                  <span className="text-2xl">🎬</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
              <span>Character</span>
              <span>Wardrobe</span>
              <span>Environment</span>
              <span>Image</span>
              <span>Video</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
