const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/profil', (req, res) => {
    res.sendFile(path.join(__dirname, '../../templates/profil.html'));
});

module.exports = router;