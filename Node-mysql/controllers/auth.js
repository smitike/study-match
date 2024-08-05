const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, //use ip adress for a server
    user: process.env.DATABASE_USER, // by default from the mysql(mamp)
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE, //use the name used when creating the db
    port: '8889'
});

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

//one email for one person
    db.query('SELECT email FROM user WHERE email = ?' , [email], (error, results) => {
        if(error) {
            console.log(error);
        }
        if(results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if(password !== passwordConfirm){
                return res.render('register', {
                    message: 'Passworddo not match'
                });
        }
    })

    res.send("Form submitted");
}