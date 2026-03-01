'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: '🏠', label: 'Home' },
  { href: '/generate', icon: '🎬', label: 'Generate Video', highlight: true },
  { href: '/flow', icon: '🔀', label: 'Pipeline View' },
  { href: '/gallery', icon: '🖼️', label: 'Gallery' },
];

const assetItems = [
  { href: '/characters', icon: '👤', label: 'Characters' },
  { href: '/wardrobes', icon: '👔', label: 'Wardrobes' },
  { href: '/products', icon: '📦', label: 'Products' },
  { href: '/environments', icon: '🌍', label: 'Environments' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-[#141414] border-r border-[#2a2a2a] flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-[#2a2a2a]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🎬</span>
          <span className="font-semibold text-sm">VidGen</span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'highlight' in item && item.highlight
                    ? 'bg-green-600 text-white'
                    : 'bg-[#2a2a2a] text-white'
                  : 'highlight' in item && item.highlight
                  ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Assets Section */}
        <div className="mt-6">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Assets
          </div>
          <div className="space-y-1 mt-1">
            {assetItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tools Section */}
        <div className="mt-6">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tools
          </div>
          <div className="space-y-1 mt-1">
            <Link
              href="/history"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === '/history'
                  ? 'bg-[#2a2a2a] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
              }`}
            >
              <span className="text-base">📜</span>
              <span>History</span>
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === '/settings'
                  ? 'bg-[#2a2a2a] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
              }`}
            >
              <span className="text-base">⚙️</span>
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#2a2a2a]">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-3">
          <p className="text-xs font-medium text-white">VidGen Pro</p>
          <p className="text-xs text-gray-400 mt-1">Unlock more features</p>
        </div>
      </div>
    </aside>
  );
}
