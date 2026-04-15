import { NextRequest, NextResponse } from 'next/server';
import { searchRegions, searchAll } from '@/lib/typesense';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'all';
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    let results;

    if (type === 'regions') {
      results = await searchRegions(query, { limit });
    } else {
      results = await searchAll(query, limit);
    }

    if (!results) {
      return NextResponse.json({ error: 'Search service unavailable' }, { status: 503 });
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
