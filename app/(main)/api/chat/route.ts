import { NextRequest, NextResponse } from 'next/server';

const RAG_API_URL = process.env.RAG_API_URL || 'http://localhost:8000';
const RAG_API_KEY = process.env.RAG_API_KEY || 'wine-rag-secret-key-2024';

export async function POST(request: NextRequest) {
  try {
    const { question, personality = 'francois' } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${RAG_API_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': RAG_API_KEY,
      },
      body: JSON.stringify({ question, personality }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('RAG API error:', error);
      return NextResponse.json(
        { error: 'Failed to get response from wine expert' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
