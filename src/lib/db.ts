import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use a more reliable path in the project root
const dbPath = path.resolve(process.cwd(), 'applications.db');
console.log('Database path:', dbPath);

// Ensure the database file exists
try {
  // Create the database file if it doesn't exist
  if (!fs.existsSync(dbPath)) {
    console.log('Creating new database file...');
    fs.writeFileSync(dbPath, '');
    console.log('Database file created successfully');
  }

  // Verify file permissions
  fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);
  console.log('Database file has read/write permissions');
} catch (error) {
  console.error('Database initialization error:', error);
  throw new Error(`Failed to initialize database: ${error.message}`);
}

// Initialize database
let db: Database.Database;
try {
  db = new Database(dbPath);
  console.log('Database connection established successfully');
} catch (error) {
  console.error('Database connection error:', error);
  throw new Error(`Failed to connect to database: ${error.message}`);
}

// Create applications table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    student_number TEXT,
    phone TEXT,
    position TEXT,
    leadership TEXT,
    education TEXT,
    why_interested TEXT,
    file_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export function saveApplication(application: {
  name: string;
  email: string;
  studentNumber?: string;
  phone?: string;
  position_applied_for?: string;
  leadership?: string[];
  education?: string[];
  why_interested?: string;
  file: File;
}): { id: number } {
  // Save file to uploads directory
  const fileExt = application.file.name.split('.').pop();
  const fileName = `${Date.now()}_${application.name.replace(/\s+/g, '_')}.${fileExt}`;
  const filePath = path.join('uploads', fileName);
  
  // In a real app, you'd save the file here
  // For now, we'll just store the file name
  
  // Save to database
  const stmt = db.prepare(`
    INSERT INTO applications (
      name, email, student_number, phone, position, 
      leadership, education, why_interested, file_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    application.name,
    application.email,
    application.studentNumber || null,
    application.phone || null,
    application.position_applied_for || null,
    JSON.stringify(application.leadership || []),
    JSON.stringify(application.education || []),
    application.why_interested || null,
    filePath
  );
  
  return { id: result.lastInsertRowid as number };
}

export function getApplications() {
  return db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
}

export function getApplicationById(id: number) {
  return db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
}
