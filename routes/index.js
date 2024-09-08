const express = require('express');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
    res.render('layout', { page: 'Home', content: 'Welcome to the User Registration System' });
});

module.exports = router;
