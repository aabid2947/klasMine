import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE');
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    // Get the endpoint from query params
    const endpoint = request.nextUrl.searchParams.get('endpoint');
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 });
    }

    // Get body for POST/PUT requests
    let body = null;
    if (method === 'POST' || method === 'PUT') {
      body = await request.json();
    }

    // Get headers from request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Forward auth headers if they exist
    const userIdHeader = request.headers.get('x-user-id');
    const sessionIdHeader = request.headers.get('x-session-id');
    
    if (userIdHeader) headers['x-user-id'] = userIdHeader;
    if (sessionIdHeader) headers['x-session-id'] = sessionIdHeader;

    // Make request to backend
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Get response data
    const data = await response.json();

    // Return response with same status
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Proxy request failed' },
      { status: 500 }
    );
  }
}
