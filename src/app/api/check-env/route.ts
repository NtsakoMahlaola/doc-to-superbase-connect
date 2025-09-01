import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    emailService: process.env.EMAIL_SERVICE,
    emailUser: process.env.EMAIL_USER ? 'Set (hidden for security)' : 'Not set',
    emailPassword: process.env.EMAIL_PASSWORD ? 'Set (hidden for security)' : 'Not set',
    nodeEnv: process.env.NODE_ENV,
  });
}
