const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use an absolute path for the database
const dbPath = path.join(__dirname, 'applications.db');
console.log('Using database path:', dbPath);

// Initialize the database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  
  console.log('Connected to the SQLite database.');
  
  // Create applications table
  db.run(`CREATE TABLE IF NOT EXISTS applications (
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
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
      return;
    }
    
    console.log('Table created or already exists');
    
    // Test insert
    db.run(`INSERT INTO applications (name, email, student_number, position) 
           VALUES (?, ?, ?, ?)`, 
      ['Test User', 'test@example.com', '12345678', 'Test Position'], 
      function(err) {
        if (err) {
          console.error('Error inserting test data:', err.message);
          return;
        }
        
        console.log(`Inserted test data with ID: ${this.lastID}`);
        
        // Query the data
        db.all('SELECT * FROM applications', [], (err, rows) => {
          if (err) {
            console.error('Error querying data:', err.message);
            return;
          }
          
          console.log('Current data in applications table:');
          console.table(rows);
          
          // Close the database connection
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err.message);
            } else {
              console.log('Database connection closed');
            }
          });
        });
      }
    );
  });
});
