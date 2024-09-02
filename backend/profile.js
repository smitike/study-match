const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('./db');

exports.createProfile = (req, res) => {
    const { school, year, classes } = req.body;
    const id = req.session.userId;
    console.log(id);

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) {
            console.error('Transaction start error:', err);
            return res.status(500).json({ message: 'Transaction start error' });
        }

        // Update user profile
        const updateQuery = 'UPDATE user SET school = ?, year = ? WHERE id = ?';
        db.query(updateQuery, [school, year, id], (error, results) => {
            if (error) {
                console.log('Database update error:', error);
                return db.rollback(() => {
                    res.status(500).json({ message: 'Failed to save profile information.' });
                });
            }

            // Delete existing classes for this user
            const deleteClassesQuery = 'DELETE FROM user_classes WHERE user_id = ?';
            db.query(deleteClassesQuery, [id], (err) => {
                if (err) {
                    console.log('Error clearing user classes:', err);
                    return db.rollback(() => {
                        res.status(500).json({ message: 'Failed to clear existing classes.' });
                    });
                }

                // Prepare data for bulk insert
                const classValues = classes.map(className => [id, className]);

                if (classValues.length === 0) {
                    // Commit transaction if no classes to insert
                    return db.commit((err) => {
                        if (err) {
                            console.error('Commit error:', err);
                            return db.rollback(() => {
                                res.status(500).json({ message: 'Failed to save profile.' });
                            });
                        }
                        return res.status(200).json({ success: true, message: 'Profile updated successfully.' });
                    });
                }

                // Insert new classes
                const insertClassQuery = 'INSERT INTO user_classes (user_id, class_name) VALUES ?';
                db.query(insertClassQuery, [classValues], (err) => {
                    if (err) {
                        console.log('Error inserting classes:', err);
                        return db.rollback(() => {
                            res.status(500).json({ message: 'Failed to save profile.' });
                        });
                    }

                    // Commit transaction
                    db.commit((err) => {
                        if (err) {
                            console.error('Commit error:', err);
                            return db.rollback(() => {
                                res.status(500).json({ message: 'Failed to save profile.' });
                            });
                        }

                        return res.status(200).json({ success: true, message: 'Profile information saved successfully!' });
                    });
                });
            });
        });
    });
};

// module.exports = router;
