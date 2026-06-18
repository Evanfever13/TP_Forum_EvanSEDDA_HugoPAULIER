const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/thread/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../templates/thread.html'));
});

module.exports = router;
