const handlerFactory = require('./handlerFactory');
const videoModal = require('../modal/videoModal');


module.exports.getAllVideo = handlerFactory.getAllDoc(videoModal);
module.exports.getOneVideo = handlerFactory.getOneDoc(videoModal);





