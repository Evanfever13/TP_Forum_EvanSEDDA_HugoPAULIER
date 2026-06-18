const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/rules', (req, res) => {
    res.sendFile(path.join(__dirname, '../../templates/rules.html'));
});

module.exports = router;