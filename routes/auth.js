const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const router = express.Router();

// Registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle registration
router.post('/register', [
    body('id', 'User_id is required').isNumeric(),
    body('user_name', 'Username is required').notEmpty(),
    body('email', 'Email is required').isEmail(),
    body('password', 'Password is required').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("here is the problem");
        return res.render('register', { errors: errors.array() });
    }

    const { id,user_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO user (id,user_name, email, password) VALUES (?, ?, ?, ?)', [id,user_name, email, hashedPassword], (err, results) => {
        if (err) {
            console.log('stuck here');
            
            throw err;}
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/auth/login');
    });
});

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            req.flash('error_msg', 'No user found with that email');
            return res.redirect('/auth/login');
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.user = user;
            req.flash('success_msg', 'You are logged in');
            res.redirect('/auth/profile');
        } else {
            req.flash('error_msg', 'Incorrect password');
            res.redirect('/auth/login');
        }
    });
});

// Profile page
router.get('/profile', (req, res) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to view this resource');
        return res.redirect('/auth/login');
    }

    res.render('profile', { user: req.session.user });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
});

module.exports = router;
