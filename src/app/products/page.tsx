'use client';

import { useEffect, useState } from 'react';
import UploadCard from '@/components/UploadCard';

interface Product {
  name: string;
  config?: {
    display_name?: string;
    description?: string;
  };
  references?: string[];
  thumbnail?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/assets?type=products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-full overflow-auto">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <div>
          <h1 className="text-lg font-semibold">Products</h1>
          <p className="text-sm text-gray-500">Product references for e-commerce videos</p>
        </div>
      </header>

      <div className="p-6">
        {/* Upload Card */}
        <div className="mb-6 max-w-sm">
          <UploadCard type="product" />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin text-2xl">⏳</div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
            <div className="text-4xl mb-3 opacity-50">📦</div>
            <h3 className="font-medium mb-2">No Products Yet</h3>
            <p className="text-sm text-gray-400">Upload a product photo above to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {products.map((product) => (
              <div 
                key={product.name} 
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition cursor-pointer"
              >
                <div className="aspect-square bg-[#0a0a0a] flex items-center justify-center">
                  {product.thumbnail ? (
                    <img 
                      src={product.thumbnail} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl opacity-30">📦</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm capitalize">{product.config?.display_name || product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.references?.length || 0} references
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
