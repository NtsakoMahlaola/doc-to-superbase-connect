import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { BOARD_MEMBER_EMAIL } from '@/config/email';

export async function GET() {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json(
        { error: 'Email configuration is missing' },
        { status: 500 }
      );
    }

    // Create a test email
    const testTransporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `Roscommon Sub-Warden Test <${process.env.EMAIL_USER}>`,
      to: BOARD_MEMBER_EMAIL,
      subject: 'Test Email from Roscommon Sub-Warden Application',
      text: 'This is a test email to verify the email functionality is working correctly.',
    };

    await testTransporter.sendMail(mailOptions);

    return NextResponse.json({ 
      message: 'Test email sent successfully!',
      sentTo: BOARD_MEMBER_EMAIL
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
