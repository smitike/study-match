const express = require("express");
const mysql = require("mysql");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: './.env'});

const app = express(); // start the server with app

// createConnection is a func so put object inside
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, //use ip adress for a server
    user: process.env.DATABASE_USER, // by default from the mysql(mamp)
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE, //use the name used when creating the db
    port: '8889'
});

// js or css for frontend
const publicDirectory = path.join(__dirname, './public'); //direname - curr directory
app.use(express.static(publicDirectory));

// grab data from any forms
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// use hbs for view engine
app.set('view engine', 'hbs');

db.connect( (error) => {
    if(error) {
        console.log(error)
    }
    else {
        console.log("mysql connected...")
    }
})

// define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

//tell express which port to listen, choose whatever
// start a function in the server
app.listen(5001, () => {
    //to print on terminal
    console.log("server started on port 5001")
});

