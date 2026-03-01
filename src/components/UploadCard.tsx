'use client';

import { useState, useRef } from 'react';

interface UploadCardProps {
  type: 'character' | 'clothing' | 'product' | 'environment';
  onUpload?: (name: string, file: File) => void;
}

export default function UploadCard({ type, onUpload }: UploadCardProps) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const typeConfig = {
    character: { icon: '👤', label: 'Character', hint: '1 face photo (front-facing ideal)' },
    clothing: { icon: '👔', label: 'Clothing', hint: '1 garment photo (any angle)' },
    product: { icon: '📦', label: 'Product', hint: '1 product photo (clean background)' },
    environment: { icon: '🌍', label: 'Environment', hint: '1 mood/style reference' },
  };

  const config = typeConfig[type];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file || !name) return;

    setUploading(true);
    setStatus('idle');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('name', name.toLowerCase().replace(/\s+/g, '-'));
      formData.append('autoExpand', 'true');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        onUpload?.(name, file);
        // Reset form
        setTimeout(() => {
          setName('');
          setFile(null);
          setPreview(null);
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{config.icon}</span>
        <div>
          <h3 className="font-medium">Add {config.label}</h3>
          <p className="text-xs text-gray-500">{config.hint}</p>
        </div>
      </div>

      {/* Name Input */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={`${config.label} name (e.g., "james", "streetwear")`}
        className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm mb-3"
      />

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed border-[#333] rounded-lg p-4 text-center cursor-pointer
          hover:border-[#555] transition min-h-[120px] flex flex-col items-center justify-center
          ${preview ? 'border-green-600/50' : ''}
        `}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-24 rounded" />
        ) : (
          <>
            <span className="text-2xl mb-2">📤</span>
            <p className="text-sm text-gray-400">Click to upload</p>
            <p className="text-xs text-gray-500">or drag and drop</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || !name || uploading}
        className={`
          w-full mt-3 py-2 rounded-lg text-sm font-medium transition
          ${!file || !name || uploading
            ? 'bg-[#333] text-gray-500 cursor-not-allowed'
            : status === 'success'
            ? 'bg-green-600 text-white'
            : status === 'error'
            ? 'bg-red-600 text-white'
            : 'bg-green-600 text-white hover:bg-green-700'
          }
        `}
      >
        {uploading
          ? '⏳ Uploading & Expanding...'
          : status === 'success'
          ? '✅ Done!'
          : status === 'error'
          ? '❌ Error - Try Again'
          : `Upload & Auto-Generate Variations`
        }
      </button>

      <p className="text-xs text-gray-500 mt-2 text-center">
        We'll generate additional angles automatically
      </p>
    </div>
  );
}
