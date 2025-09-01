const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'applications.db');

console.log('Current working directory:', process.cwd());
console.log('Database path:', dbPath);

// Check if file exists
try {
  const exists = fs.existsSync(dbPath);
  console.log('Database file exists:', exists);
  
  if (exists) {
    const stats = fs.statSync(dbPath);
    console.log('File stats:', {
      size: stats.size,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      permissions: {
        read: fs.constants.R_OK ? 'Yes' : 'No',
        write: fs.constants.W_OK ? 'Yes' : 'No'
      },
      lastModified: stats.mtime
    });
  }
} catch (error) {
  console.error('Error checking database file:', error);
}
