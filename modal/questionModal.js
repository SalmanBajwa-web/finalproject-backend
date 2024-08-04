const mongoose = require('mongoose');
const questionSchema = mongoose.Schema({
    question: {
        type: String,
    },
    answer: {
        type: String,
    },
    choice :{
        type:[String],
    },
    subject:{
        type: String,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
      },

   });

const questionModal = mongoose.model('Question', questionSchema);

module.exports = questionModal;