import { NextRequest, NextResponse } from 'next/server';
import { BulkScanRequestSchema, BulkScanResponseSchema } from '@gate-access/types';

const MOCK_SCAN_RESULTS: Array<{ id: string; status: 'SUCCESS' | 'FAILED' }> = [];

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    const validation = BulkScanRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { scans } = validation.data;
    
    const synced: string[] = [];
    const failed: Array<{ id: string; error: string }> = [];

    for (const scan of scans) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      if (Math.random() > 0.1) {
        synced.push(scan.id);
        MOCK_SCAN_RESULTS.push({ id: scan.id, status: 'SUCCESS' });
      } else {
        failed.push({ id: scan.id, error: 'Mock validation error' });
        MOCK_SCAN_RESULTS.push({ id: scan.id, status: 'FAILED' });
      }
    }

    const response = {
      success: true,
      synced,
      failed,
    };

    return NextResponse.json({
      success: true,
      data: BulkScanResponseSchema.parse(response),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    data: {
      total: MOCK_SCAN_RESULTS.length,
      results: MOCK_SCAN_RESULTS,
    },
  });
}
