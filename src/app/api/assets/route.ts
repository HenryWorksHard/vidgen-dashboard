import { NextResponse } from 'next/server';
import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const SKILL_PATH = process.env.VIDGEN_SKILL_PATH || '/Users/cmpdbot/clawd/skills/vidgen';

interface Asset {
  name: string;
  type: 'character' | 'wardrobe' | 'environment' | 'style';
  config?: Record<string, unknown>;
  references?: string[];
  thumbnail?: string;
}

async function getAssets(type: string): Promise<Asset[]> {
  const dirPath = join(SKILL_PATH, `${type}s`);
  
  if (!existsSync(dirPath)) {
    return [];
  }

  const entries = await readdir(dirPath, { withFileTypes: true });
  const assets: Asset[] = [];

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('_')) {
      const assetPath = join(dirPath, entry.name);
      const configPath = join(assetPath, 'config.yaml');
      const refPath = join(assetPath, 'reference');

      const asset: Asset = {
        name: entry.name,
        type: type as Asset['type'],
      };

      // Read config if exists
      if (existsSync(configPath)) {
        const configContent = await readFile(configPath, 'utf-8');
        asset.config = parseYaml(configContent);
      }

      // Get reference images
      if (existsSync(refPath)) {
        const refs = await readdir(refPath);
        asset.references = refs.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
        if (asset.references.length > 0) {
          asset.thumbnail = `/api/image?path=${encodeURIComponent(join(refPath, asset.references[0]))}`;
        }
      }

      assets.push(asset);
    }
  }

  return assets;
}

function parseYaml(content: string): Record<string, unknown> {
  // Simple YAML parser for basic key-value pairs
  const result: Record<string, unknown> = {};
  const lines = content.split('\n');
  let currentKey = '';
  let currentValue = '';
  let inMultiline = false;

  for (const line of lines) {
    if (line.startsWith('#') || line.trim() === '') continue;
    
    if (!inMultiline && line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      
      if (value === '|' || value === '>') {
        currentKey = key.trim();
        currentValue = '';
        inMultiline = true;
      } else if (value.startsWith('"') && value.endsWith('"')) {
        result[key.trim()] = value.slice(1, -1);
      } else if (value) {
        result[key.trim()] = value;
      }
    } else if (inMultiline) {
      if (line.startsWith('  ')) {
        currentValue += line.trim() + ' ';
      } else {
        result[currentKey] = currentValue.trim();
        inMultiline = false;
        // Process current line as new key
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();
          if (value) result[key.trim()] = value;
        }
      }
    }
  }

  if (inMultiline && currentKey) {
    result[currentKey] = currentValue.trim();
  }

  return result;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    if (type) {
      const assets = await getAssets(type.replace(/s$/, '')); // Remove trailing 's'
      return NextResponse.json(assets);
    }

    // Return all assets
    const [characters, wardrobes, environments] = await Promise.all([
      getAssets('model'),
      getAssets('wardrobe'),
      getAssets('environment'),
    ]);

    return NextResponse.json({
      characters,
      wardrobes,
      environments,
    });
  } catch (error) {
    console.error('Error reading assets:', error);
    return NextResponse.json({ error: 'Failed to read assets' }, { status: 500 });
  }
}
