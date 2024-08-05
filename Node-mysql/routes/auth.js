const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

//grab info from register
router.post('/register', authController.register )

// "post" only access this after submitting
router.post('/register', (req, res) => {
    res.render('index');
});

module.exports = router;
