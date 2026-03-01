import { NextResponse } from 'next/server';
import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const SKILL_PATH = process.env.VIDGEN_SKILL_PATH || '/Users/cmpdbot/clawd/skills/vidgen';
const OUTPUT_PATH = join(SKILL_PATH, 'output');
const LOGS_PATH = join(SKILL_PATH, 'logs');

interface Generation {
  id: string;
  timestamp: string;
  character?: string;
  wardrobe?: string;
  environment?: string;
  prompt: string;
  imagePath?: string;
  videoPath?: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

async function getGenerations(): Promise<Generation[]> {
  const generations: Generation[] = [];

  // Check for log files first (structured data)
  if (existsSync(LOGS_PATH)) {
    const logFiles = await readdir(LOGS_PATH);
    for (const file of logFiles) {
      if (file.endsWith('.json')) {
        try {
          const content = await readFile(join(LOGS_PATH, file), 'utf-8');
          const gen = JSON.parse(content) as Generation;
          generations.push(gen);
        } catch (e) {
          console.error(`Error reading log file ${file}:`, e);
        }
      }
    }
  }

  // Also scan output directory for any unlogged generations
  if (existsSync(OUTPUT_PATH)) {
    const dateDirs = await readdir(OUTPUT_PATH);
    
    for (const dateDir of dateDirs) {
      const datePath = join(OUTPUT_PATH, dateDir);
      const dirStat = await stat(datePath);
      
      if (dirStat.isDirectory()) {
        const files = await readdir(datePath);
        
        // Group by base name (without extension)
        const groups = new Map<string, { image?: string; video?: string }>();
        
        for (const file of files) {
          const baseName = file.replace(/\.(jpg|jpeg|png|mp4|webm)$/i, '');
          if (!groups.has(baseName)) {
            groups.set(baseName, {});
          }
          const group = groups.get(baseName)!;
          
          if (/\.(jpg|jpeg|png)$/i.test(file)) {
            group.image = join(datePath, file);
          } else if (/\.(mp4|webm)$/i.test(file)) {
            group.video = join(datePath, file);
          }
        }

        // Create generation entries for each group
        for (const [baseName, files] of groups) {
          // Skip if already in logs
          if (generations.some(g => g.id === baseName)) continue;

          // Parse filename: character-environment-timestamp
          const parts = baseName.split('-');
          const timestamp = parts.pop() || '';
          const environment = parts.pop() || '';
          const character = parts.join('-') || '';

          generations.push({
            id: baseName,
            timestamp: `${dateDir}T${timestamp.slice(0, 2)}:${timestamp.slice(2, 4)}:${timestamp.slice(4, 6)}`,
            character: character || undefined,
            environment: environment || undefined,
            prompt: `${character} in ${environment}`,
            imagePath: files.image,
            videoPath: files.video,
            status: files.video ? 'complete' : (files.image ? 'complete' : 'pending'),
          });
        }
      }
    }
  }

  // Sort by timestamp, newest first
  generations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return generations;
}

export async function GET() {
  try {
    const generations = await getGenerations();
    return NextResponse.json({ generations });
  } catch (error) {
    console.error('Error reading generations:', error);
    return NextResponse.json({ error: 'Failed to read generations', generations: [] }, { status: 500 });
  }
}
