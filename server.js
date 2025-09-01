const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Test file system endpoint
app.post('/api/check-fs', (req, res) => {
  const testFilePath = path.join(__dirname, 'test-fs.txt');
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
    
    res.json({
      success: true,
      fileSystemAccess: true,
      fileExists,
      fileContentMatches: fileContent === testContent,
      currentWorkingDirectory: process.cwd(),
      filesInDirectory: fs.readdirSync(process.cwd())
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      currentWorkingDirectory: process.cwd(),
      filesInDirectory: fs.readdirSync(process.cwd())
    });
  }
});

// Test database endpoint
app.post('/api/test-db', (req, res) => {
  const dbPath = path.join(__dirname, 'applications.db');
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: `Error opening database: ${err.message}`,
        dbPath
      });
    }

    db.serialize(() => {
      // Create table if not exists
      db.run(`CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: `Error creating table: ${err.message}`
          });
        }

        // Insert test data
        db.run(`INSERT INTO applications (name, email) VALUES (?, ?)`,
          ['Test User', 'test@example.com'],
          function(err) {
            if (err) {
              return res.status(500).json({
                success: false,
                error: `Error inserting test data: ${err.message}`
              });
            }

            // Query the data
            db.all('SELECT * FROM applications', [], (err, rows) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  error: `Error querying data: ${err.message}`
                });
              }

              res.json({
                success: true,
                message: 'Database test completed successfully',
                insertedId: this.lastID,
                data: rows
              });

              // Close the database connection
              db.close();
            });
          }
        );
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Current working directory: ${process.cwd()}`);
  console.log('Available endpoints:');
  console.log(`- POST http://localhost:${PORT}/api/check-fs`);
  console.log(`- POST http://localhost:${PORT}/api/test-db`);
  console.log(`- GET  http://localhost:${PORT}/check-fs.html`);
});
