// ABOUTME: API route to fetch MediaMTX streams from vhub.chaos1.au
// ABOUTME: Acts as a proxy to avoid CORS issues and provides stream list with Basic Auth
import { NextResponse } from 'next/server';

const MEDIAMTX_API = process.env.MEDIAMTX_API_URL || 'https://vhub.chaos1.au:9997/v3/paths/list';
const MEDIAMTX_USERNAME = process.env.MEDIAMTX_USERNAME;
const MEDIAMTX_PASSWORD = process.env.MEDIAMTX_PASSWORD;

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    // Add Basic Auth if credentials are provided
    if (MEDIAMTX_USERNAME && MEDIAMTX_PASSWORD) {
      const credentials = Buffer.from(`${MEDIAMTX_USERNAME}:${MEDIAMTX_PASSWORD}`).toString('base64');
      headers['Authorization'] = `Basic ${credentials}`;
    }

    const fetchResponse = await fetch(MEDIAMTX_API, {
      method: 'GET',
      headers,
      // @ts-ignore - Node.js fetch options
      rejectUnauthorized: false,
    });

    if (!fetchResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch streams from MediaMTX' },
        { status: fetchResponse.status }
      );
    }

    const data = await fetchResponse.json();

    // Transform the data to a simpler format
    const streams = data.items?.map((item: any) => ({
      name: item.name,
      type: item.source?.type || 'unknown',
      tracks: item.tracks || [],
      ready: item.ready,
      readyTime: item.readyTime,
      bytesReceived: item.bytesReceived,
      bytesSent: item.bytesSent,
      readers: item.readers?.length || 0,
    })) || [];

    const response = NextResponse.json({
      itemCount: data.itemCount || 0,
      streams,
    });

    // Set cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error fetching MediaMTX streams:', error);
    return NextResponse.json(
      { error: 'Failed to connect to MediaMTX server' },
      { status: 500 }
    );
  }
}
