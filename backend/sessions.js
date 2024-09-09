// sessions.js

const express = require('express');
const router = express.Router();
const db = require('./db'); 

// Endpoint to create a session
router.post('/create-session', (req, res) => {
    const { userId, className, purpose, fromTime, toTime, sessionDate, location } = req.body;

    const query = `
        INSERT INTO study_sessions (user_id, class_name, purpose, from_time, to_time, session_date, location) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [userId, className, purpose, fromTime, toTime, sessionDate, location], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Error creating session' });
        }
        res.status(201).json({ message: 'Successfully created your session!', sessionId: results.insertId });
    });
});

// Route to get all sessions for a specific user
router.get('/user/sessions/:id', (req, res) => {
    const userId = req.params.id;

    const query = `
        SELECT * FROM study_sessions WHERE user_id = ?
    `;

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ message: 'Error fetching sessions' });
        }

        res.json({ sessions: results });
    });
});

// Endpoint to get available sessions for a user
router.get('/available-sessions/:userId', (req, res) => {
    const userId = req.params.userId;

    // Fetch user's classes and school
    const fetchUserClassesAndSchoolQuery = 'SELECT classes, school FROM user WHERE id = ?';

    db.query(fetchUserClassesAndSchoolQuery, [userId], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ message: 'Error fetching user classes and school' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Parse user's classes and get user's school
        const userClasses = JSON.parse(results[0].classes); // Assuming classes are stored as a JSON string array
        const userSchool = results[0].school;

        // Prepare placeholders for the SQL query
        const placeholders = userClasses.map(() => '?').join(',');

        // Query to fetch sessions created by others for user's classes and school
        const fetchSessionsQuery = `
            SELECT * FROM study_sessions 
            WHERE user_id != ? 
            AND school = ? 
            AND class_name IN (${placeholders})
        `;

        // Combine the userId, userSchool, and userClasses in the query parameters
        const queryParams = [userId, userSchool, ...userClasses];

        db.query(fetchSessionsQuery, queryParams, (error, sessions) => {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).json({ message: 'Error fetching study sessions' });
            }

            res.status(200).json({ sessions });
        });
    });
});

// Endpoint to join a session
router.post('/join-session', (req, res) => {
    const { userId, sessionId } = req.body;

    // Check if the user has already joined the session
    db.query('SELECT * FROM session_participants WHERE user_id = ? AND session_id = ?', [userId, sessionId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database query error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'User has already joined the session' });
        }

        // Insert the new participant
        db.query('INSERT INTO session_participants (user_id, session_id) VALUES (?, ?)', [userId, sessionId], (err, result) => {
            if (err) {
                console.error('Database insert error:', err);
                return res.status(500).json({ message: 'Failed to join session' });
            }

            // Increment the participants count
            db.query('UPDATE study_sessions SET participants = participants + 1 WHERE id = ?', [sessionId], (err) => {
                if (err) {
                    console.error('Error updating participants count:', err);
                    return res.status(500).json({ message: 'Error updating participants count' });
                }

                return res.status(200).json({ message: 'Successfully joined the session!' });
            });
        });
    });
});

// Route to get all sessions a user has joined
router.get('/user/joined-sessions/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT study_sessions.* 
        FROM study_sessions
        JOIN session_participants ON study_sessions.id = session_participants.session_id
        WHERE session_participants.user_id = ?
    `;

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ message: 'Error fetching joined sessions' });
        }

        res.json({ sessions: results });
    });
});

router.post('/leave-session', (req, res) => {
    const { userId, sessionId } = req.body;

    // Remove the participant
    db.query('DELETE FROM session_participants WHERE user_id = ? AND session_id = ?', [userId, sessionId], (err, result) => {
        if (err) {
            console.error('Database delete error:', err);
            return res.status(500).json({ message: 'Failed to leave session' });
        }

        // Decrement the participants count
        db.query('UPDATE study_sessions SET participants = participants - 1 WHERE id = ?', [sessionId], (err) => {
            if (err) {
                console.error('Error updating participants count:', err);
                return res.status(500).json({ message: 'Error updating participants count' });
            }

            return res.status(200).json({ message: 'Successfully left the session!' });
        });
    });
});


module.exports = router;