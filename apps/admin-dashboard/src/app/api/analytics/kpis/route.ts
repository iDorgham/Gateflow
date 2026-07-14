import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Mock KPI data
  const kpis = {
    totalScans: 1240000,
    activeUsers: 84200,
    revenue: 284000,
    conversionRate: 0.048,
    trends: {
      scans: 0.125,
      users: 0.054,
      revenue: -0.021,
      conversion: 0.008,
    },
  };

  return NextResponse.json({ success: true, kpis });
}
