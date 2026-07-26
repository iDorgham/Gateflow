import { NextResponse } from 'next/server';

/**
 * Track UTM parameters when QR code is accessed
 * Updates QRCode record with attribution data
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'Use the QR short link for campaign attribution',
    },
    { status: 410 }
  );
}
