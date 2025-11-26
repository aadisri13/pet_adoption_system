require('dotenv').config();
const mysql = require('mysql2/promise');

// Build connection config - minimal to avoid SSL issues
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306, // Changed default to 3306 (classic protocol)
  user: process.env.DB_USER || 'root',
  database: process.env.DB_NAME || 'pet_adoption_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Add these to help with protocol compatibility
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Only add password if it's provided and not empty
// If password is empty string or undefined, don't include it at all
const password = process.env.DB_PASSWORD;
if (password && password.trim() !== '') {
  dbConfig.password = password;
} else {
  // Explicitly don't set password - let MySQL handle no password
  // Don't set dbConfig.password at all
}

// Handle SSL - if your MySQL requires SSL, you might need to enable it
// Try both: first without SSL, if that fails, try with SSL
if (process.env.DB_SSL === 'true') {
  dbConfig.ssl = {
    rejectUnauthorized: false
  };
}
// If DB_SSL is false or not set, don't include ssl property

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection with better error handling
setTimeout(() => {
  console.log('Attempting database connection...');
  console.log('Config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database,
    hasPassword: !!dbConfig.password
  });
  
  pool.getConnection()
    .then(connection => {
      console.log('✅ Database connected successfully');
      connection.release();
    })
    .catch(err => {
      console.error('❌ Database connection error:', err.message);
      if (err.stack) {
        console.error('Stack:', err.stack);
      }
    });
}, 100); // Small delay to let server start first

module.exports = pool;

