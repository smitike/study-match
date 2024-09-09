require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const auth = require('./auth');
const profile = require('./profile');

const app = express();
app.use(express.json());
app.use(cors());

const userRoutes = require('./user');
const sessionRoutes = require('./sessions');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); 

app.use('/user', userRoutes);
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));
app.use('/sessions', sessionRoutes);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: process.env.DATABASE_HOST,
        port: 8889,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }),
    cookie: { secure: false } // Use secure: true if using HTTPS
}));

// app.use('/auth', auth);  // Use the auth routes
app.post('/register', auth.register); // Use the register function from auth.js
app.post('/login', auth.login); // Use the login function from auth.js

app.post('/profile_creation', profile.createProfile);
// app.use('/profile', profile);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
