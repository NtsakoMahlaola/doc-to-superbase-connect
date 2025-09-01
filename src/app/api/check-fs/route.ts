import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  const testFilePath = path.join(process.cwd(), 'test-fs.txt');
  const testContent = 'Test file content';
  
  try {
    // Try to write a file
    fs.writeFileSync(testFilePath, testContent);
    
    // Verify the file was written
    const fileExists = fs.existsSync(testFilePath);
    let fileContent = '';
    
    if (fileExists) {
      fileContent = fs.readFileSync(testFilePath, 'utf-8');
      // Clean up the test file
      fs.unlinkSync(testFilePath);
    }
    
    return NextResponse.json({
      success: true,
      fileSystemAccess: true,
      fileExists,
      fileContentMatches: fileContent === testContent,
      currentWorkingDirectory: process.cwd(),
      filesInDirectory: fs.readdirSync(process.cwd())
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      currentWorkingDirectory: process.cwd(),
      filesInDirectory: fs.readdirSync(process.cwd())
    }, { status: 500 });
  }
}
