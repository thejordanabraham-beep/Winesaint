import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Read from JSON file in app/data directory
    const dataDir = path.join(process.cwd(), 'app', 'data');
    const filePath = path.join(dataDir, `${slug}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const content = JSON.parse(fileContent);

    return NextResponse.json({
      slug,
      title: content.guide_type || slug,
      content,
    });
  } catch (error) {
    console.error('Error fetching resource guide:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
