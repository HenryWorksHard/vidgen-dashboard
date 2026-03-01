'use client';

import Link from 'next/link';
import UploadCard from '@/components/UploadCard';

export default function Home() {
  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <div>
          <h1 className="text-lg font-semibold">VidGen Pro</h1>
          <p className="text-sm text-gray-500">Upload 1 image → Get complete video</p>
        </div>
        <Link 
          href="/generate"
          className="px-4 py-2 text-sm bg-green-600 rounded-lg hover:bg-green-700 transition"
        >
          🎬 Generate Video →
        </Link>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Quick Upload Section */}
        <section className="mb-8">
          <h2 className="font-medium mb-4">Quick Add Assets</h2>
          <p className="text-sm text-gray-400 mb-4">
            Upload 1 reference image per category. We auto-generate all needed angles & variations.
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <UploadCard type="character" />
            <UploadCard type="clothing" />
            <UploadCard type="product" />
            <UploadCard type="environment" />
          </div>
        </section>

        {/* Pipeline Overview */}
        <section className="mb-8">
          <h2 className="font-medium mb-4">Generation Pipeline</h2>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {/* Step 1 */}
              <div className="flex flex-col items-center min-w-[100px]">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-xl">📤</span>
                </div>
                <span className="text-xs text-gray-400">1. Upload</span>
                <span className="text-xs text-gray-500">1 image each</span>
              </div>
              
              <div className="text-gray-600 px-2">→</div>

              {/* Step 2 */}
              <div className="flex flex-col items-center min-w-[100px]">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-xl">🔄</span>
                </div>
                <span className="text-xs text-gray-400">2. Expand</span>
                <span className="text-xs text-gray-500">Auto-generate</span>
              </div>

              <div className="text-gray-600 px-2">→</div>

              {/* Step 3 */}
              <div className="flex flex-col items-center min-w-[100px]">
                <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-xl">🎨</span>
                </div>
                <span className="text-xs text-gray-400">3. Midjourney</span>
                <span className="text-xs text-gray-500">Generate image</span>
              </div>

              <div className="text-gray-600 px-2">→</div>

              {/* Step 4 */}
              <div className="flex flex-col items-center min-w-[100px]">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-xl">✨</span>
                </div>
                <span className="text-xs text-gray-400">4. Magnific</span>
                <span className="text-xs text-gray-500">Upscale</span>
              </div>

              <div className="text-gray-600 px-2">→</div>

              {/* Step 5 */}
              <div className="flex flex-col items-center min-w-[100px]">
                <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-xl">🎬</span>
                </div>
                <span className="text-xs text-gray-400">5. Kling</span>
                <span className="text-xs text-gray-500">Video</span>
              </div>

              <div className="text-gray-600 px-2">→</div>

              {/* Output */}
              <div className="flex flex-col items-center min-w-[100px]">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-xl">🎥</span>
                </div>
                <span className="text-xs text-gray-400">Output</span>
                <span className="text-xs text-gray-500">HD Video</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-8">
          <h2 className="font-medium mb-4">Manage Assets</h2>
          <div className="grid grid-cols-4 gap-4">
            <Link 
              href="/characters"
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">👤</span>
                <div>
                  <h3 className="font-medium text-sm">Characters</h3>
                  <p className="text-xs text-gray-500">Face references</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/wardrobes"
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">👔</span>
                <div>
                  <h3 className="font-medium text-sm">Wardrobes</h3>
                  <p className="text-xs text-gray-500">Clothing</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/products"
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📦</span>
                <div>
                  <h3 className="font-medium text-sm">Products</h3>
                  <p className="text-xs text-gray-500">E-commerce</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/environments"
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🌍</span>
                <div>
                  <h3 className="font-medium text-sm">Environments</h3>
                  <p className="text-xs text-gray-500">Backgrounds</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Recent Generations */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Recent Generations</h2>
            <Link href="/gallery" className="text-sm text-gray-400 hover:text-white">
              View all →
            </Link>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="text-center py-4">
              <div className="text-3xl mb-2 opacity-50">🎬</div>
              <p className="text-sm text-gray-400">No generations yet</p>
              <p className="text-xs text-gray-500">Upload assets above to get started</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
