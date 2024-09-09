// user.js

const express = require('express');
const router = express.Router();
const db = require('./db'); 
const multer = require('multer');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory where files will be saved
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Route to handle profile picture upload
  router.post('/upload-profile-pic', upload.single('profilePic'), (req, res) => {
      const userId = req.body.userId;
      const profilePicPath = req.file ? req.file.path : null;
  
      if (!profilePicPath) {
          return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // Update the user's profile picture URL in the database
      db.query('UPDATE user SET profile_pic_url = ? WHERE id = ?', [profilePicPath, userId], (err, result) => {
          if (err) {
              console.error('Database update error:', err);
              return res.status(500).json({ message: 'Error updating profile picture' });
          }
  
          res.status(200).json({ message: 'Profile picture uploaded successfully', profilePicUrl: profilePicPath });
      });
  });

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

router.get('/sessions/:userId', (req, res) => {
    const userId = req.params.userId;

    // Query to fetch sessions for the given user
    db.query('SELECT * FROM sessions WHERE user_id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ message: 'Database query error' });
        }

        res.status(200).json({ sessions: results });
    });
});



module.exports = router;