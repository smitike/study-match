const mysql = require("mysql");
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: '8889'
});

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

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

        db.query('INSERT INTO user SET ?', { username: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'User registration failed' });
            } else {
                console.log(results);
                return res.status(201).json({ message: 'User registered' });
            }
        });
    });
};

// Login function
exports.login = (req, res) => {
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

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);

        if (!isMatch) {
            console.log("Password does not match.");
            return res.status(400).json({ message: 'Email or Password is incorrect' });
        }

        console.log("Login successful.");
        return res.status(200).json({ message: 'Successfully logged in' });
    });
};
