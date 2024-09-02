const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('./db');
const mysql = require("mysql");


exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm, school, year, classes } = req.body;

    db.query('SELECT email FROM user WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Database query error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'That email is already in use' });
        } else if (password !== passwordConfirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        const classesString = JSON.stringify(classes);

        db.query('INSERT INTO user SET ?', { username: name, email: email, password: hashedPassword, school: school, year: year, classes: classesString }, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'User registration failed' });
            } else {
                console.log(results);
                const userId = results.insertId;
                return res.status(201).json({ message: 'User registered', userId });

                // req.session.userId = userId;
                // console.log(userId);
                // return res.status(201).json({ message: 'User registered', userId});
            }
        });
    });
};
// req.session.userId = user.id;
// Login function
exports.login =  (req, res) => {
    const { email, password } = req.body;

    console.log(`Attempting to log in with email: ${email}`);

    db.query('SELECT * FROM user WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log("Database query error:", error);
            return res.status(500).json({ message: 'Database query error' });
        }

        if (results.length === 0) {
            console.log("No user found with this email.");
            return res.status(400).json({ message: 'Email or Password is incorrect' });
        }

        const user = results[0];
        console.log("User found:", user);
        const userId = user.id;
        // req.session.userId = user.id; // Store user ID in session
        // res.json({ success: true, message: 'Logged in' });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);

        if (!isMatch) {
            console.log("Password does not match.");
            return res.status(400).json({ message: 'Email or Password is incorrect' });
        }

        console.log("Login successful.");
        req.session.userId = user.id;
        return res.status(200).json({ message: 'Successfully logged in' });
    });
};

// module.exports = router;
