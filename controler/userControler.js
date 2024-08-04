const catchAsync = require('./../utils/catchAsync');
const User = require('./../modal/userModal');
const factory = require('../controler/handlerFactory');

const APIFeatures = require('./../utils/APIFeatures');
const errClass = require('../utils/errorClass');
// this not valid we use signUp instead
// exports.createUser = catchAsync(async (req,res,next)=>{
//     res.status(500).json({
//         status:'fail',
//         message:'Please user /signUp route.'
//     });
// });

let getAllUserMode = modal =>catchAsync(async (req,res,next)=>{
    // make query
    let apiFeatures = new APIFeatures(modal.find(),req.query);
    apiFeatures.filtering().sort().select().pagination();
   
    // then await
    let doc = await apiFeatures.query.select('+password');
    if(!doc) return next(new errClass('No document found!',404));
    res.status(200).json({
        status:'success',
        results:doc.length,
        data:{
            data:doc
        }
    });
});


exports.createUser = factory.createDoc(User);
exports.updateUser = factory.updateDoc(User);

exports.getAllUser = getAllUserMode(User);



exports.getOneUser = factory.getOneDoc(User);
exports.deleteUser = factory.deleteDoc(User);
