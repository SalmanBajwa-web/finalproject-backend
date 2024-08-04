const handlerFactory = require('./handlerFactory');
const questionModal = require('../modal/questionModal');



exports.getAllQuestion = handlerFactory.getAllDoc(questionModal);
exports.getOneQuestion = handlerFactory.getOneDoc(questionModal);
exports.createQuestion = handlerFactory.createDoc(questionModal);
exports.updateQuestion = handlerFactory.updateDoc(questionModal);
exports.deleteQuestion = handlerFactory.deleteDoc(questionModal);


