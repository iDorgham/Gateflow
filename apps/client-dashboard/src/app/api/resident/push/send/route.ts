import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: 'This notification endpoint is no longer available',
    },
    { status: 410 }
  );
}
