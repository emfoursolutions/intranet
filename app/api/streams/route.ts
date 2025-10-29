// ABOUTME: API route to fetch MediaMTX streams from vhub.chaos1.au
// ABOUTME: Acts as a proxy to avoid CORS issues and provides stream list
import { NextResponse } from 'next/server';

const MEDIAMTX_API = 'https://vhub.chaos1.au:9997/v3/paths/list';

export async function GET() {
  try {
    const response = await fetch(MEDIAMTX_API, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Disable SSL verification if needed for self-signed certs
      // @ts-ignore
      rejectUnauthorized: false,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch streams from MediaMTX' },
        { status: response.status }
      );
    }

    const data = await response.json();

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

    return NextResponse.json({
      itemCount: data.itemCount || 0,
      streams,
    });
  } catch (error) {
    console.error('Error fetching MediaMTX streams:', error);
    return NextResponse.json(
      { error: 'Failed to connect to MediaMTX server' },
      { status: 500 }
    );
  }
}
