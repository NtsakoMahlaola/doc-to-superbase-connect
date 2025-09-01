import { NextResponse } from 'next/server';
import { saveApplication } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    console.log('Received application submission');
    const formData = await request.formData();
    
    // Log all form data keys
    console.log('Form data keys:', [...formData.keys()]);
    
    // Extract form data
    const data = Object.fromEntries(formData.entries());
    console.log('Parsed form data:', data);
    
    const file = formData.get('file') as File | null;
    console.log('File received:', file ? {
      name: file.name,
      type: file.type,
      size: file.size
    } : 'No file');
    
    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    try {
      // Save application to database
      console.log('Attempting to save application...');
      const result = saveApplication({
        name: data.name as string,
        email: data.email as string,
        studentNumber: data.studentNumber as string,
        phone: data.phone as string,
        position_applied_for: data.position_applied_for as string,
        leadership: typeof data.leadership === 'string' ? JSON.parse(data.leadership) : [],
        education: typeof data.education === 'string' ? JSON.parse(data.education) : [],
        why_interested: data.why_interested as string,
        file: file
      });
      
      console.log('Application saved successfully:', result);
      return NextResponse.json({
        success: true,
        applicationId: result.id
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }
    
  } catch (error) {
    console.error('Error in submit-application:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit application',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
}
