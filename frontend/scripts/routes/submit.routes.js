const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/submit', (req, res) => {
    res.sendFile(path.join(__dirname, '../../templates/submit.html'));
});

module.exports = router;