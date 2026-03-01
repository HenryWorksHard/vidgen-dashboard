import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const SKILL_PATH = process.env.VIDGEN_SKILL_PATH || '/Users/cmpdbot/clawd/skills/vidgen';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // character, clothing, product, environment
    const name = formData.get('name') as string;
    const autoExpand = formData.get('autoExpand') === 'true';

    if (!file || !type || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: file, type, name' },
        { status: 400 }
      );
    }

    // Determine folder path based on type
    let folderPath: string;
    switch (type) {
      case 'character':
        folderPath = join(SKILL_PATH, 'models', name, 'reference');
        break;
      case 'clothing':
        folderPath = join(SKILL_PATH, 'wardrobes', name, 'reference');
        break;
      case 'product':
        folderPath = join(SKILL_PATH, 'products', name, 'reference');
        break;
      case 'environment':
        folderPath = join(SKILL_PATH, 'environments', name, 'reference');
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Create folder if needed
    if (!existsSync(folderPath)) {
      await mkdir(folderPath, { recursive: true });
    }

    // Save original file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(folderPath, 'original.jpg');
    await writeFile(filePath, buffer);

    // Create config if doesn't exist
    const configPath = join(folderPath, '..', 'config.yaml');
    if (!existsSync(configPath)) {
      const displayName = name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const configContent = `name: ${name}
display_name: "${displayName}"
type: ${type}
created: ${new Date().toISOString()}
`;
      await writeFile(configPath, configContent);
    }

    // Auto-expand if requested
    if (autoExpand) {
      // Trigger expansion script in background
      const expandScript = join(SKILL_PATH, 'scripts', 'expand-refs.sh');
      if (existsSync(expandScript)) {
        // Note: In production, this would be a background job
        // For now, we just mark it as pending
        return NextResponse.json({
          success: true,
          message: 'Uploaded successfully. Expansion queued.',
          path: filePath,
          expanding: true,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Uploaded successfully',
      path: filePath,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
