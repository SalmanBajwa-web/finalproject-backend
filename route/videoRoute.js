const express = require('express');
const router = express.Router();
const videoControler = require('../controler/videoControler');

// CRUD
router.route('/')
    .get(videoControler.getAllVideo);
router.route('/:id')
    .get(videoControler.getOneVideo);




module.exports = router;