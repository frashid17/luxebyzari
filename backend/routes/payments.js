const express = require('express');
const router = express.Router();

// Temporary route
router.get('/', (req, res) => {
    res.json({ message: 'Products route working' });
});

module.exports = router;