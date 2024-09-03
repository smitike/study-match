// user.js

const express = require('express');
const router = express.Router();
const db = require('./db'); // Make sure you have a database connection

// Fetch user profile by ID
router.get('/profile/:id', (req, res) => {
    const userId = req.params.id;

    // Query the database for user info
    db.query('SELECT username, email, school, year, classes FROM user WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        // Map year number to year string
        const yearMapping = { '1': 'Freshman', '2': 'Sophomore', '3': 'Junior' };
        user.year = yearMapping[user.year] || 'Senior';

        // Convert classes JSON string to array
        user.classes = JSON.parse(user.classes);

        res.json(user);
    });
});

module.exports = router;
