const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Database connection pool setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'superfin_db',
    password: 'chetansql',
    port: 5001,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Import and use the auth router
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database connected successfully:', res.rows[0]);
    }
});

// A simple test route to ensure the server is working
app.get('/', (req, res) => {
  res.send('Superfin Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});