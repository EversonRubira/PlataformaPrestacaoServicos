const express = require('express');
const router = express.Router();
const passport = require('./passport-mysql');
const connection = require('./db');
const bcrypt = require('bcrypt');

// Route to register a new user
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send('Error hashing password');
        }

        connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], (err, results) => {
            if (err) {
                return res.status(500).send('Error inserting user');
            }
            res.status(201).send('User registered');
        });
    });
});

// Route to login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

// Route to logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

module.exports = router;
