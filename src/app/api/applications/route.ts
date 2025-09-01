import { NextResponse } from 'next/server';
import { getApplications } from '@/lib/db';

export async function GET() {
  try {
    const applications = getApplications();
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
