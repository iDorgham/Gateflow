import { NextResponse } from 'next/server';

export function GET(): NextResponse {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'client-dashboard',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
