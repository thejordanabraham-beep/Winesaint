import { NextResponse } from 'next/server';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const result = await pool.query(
      'SELECT slug, title, content FROM resource_guides WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching resource guide:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
