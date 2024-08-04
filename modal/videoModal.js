const mongoose = require('mongoose');
const videoSchema = mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
   });

const videoModal = mongoose.model('Video', videoSchema);

module.exports = videoModal;