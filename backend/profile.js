const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Create a connection to the database (example)
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: '8889'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

router.post('/profile', (req, res) => {
    const { school, year, classes } = req.body;

    // Insert the profile data into your database
    const query = 'INSERT INTO profiles (school, year, classes) VALUES (?, ?, ?)';
    const classList = classes.join(', '); // Convert array to string

    db.query(query, [school, year, classList], (error, results) => {
        if (error) {
            console.log('Database insert error:', error);
            return res.status(500).json({ message: 'Failed to save profile information.' });
        }

        return res.status(200).json({ success: true, message: 'Profile information saved successfully!' });
    });
});

module.exports = router;
