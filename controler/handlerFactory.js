const APIFeatures = require('./../utils/APIFeatures');
const catchAsync = require('./../utils/catchAsync');
const errClass = require('../utils/errorClass');


exports.createDoc = modal =>catchAsync(async (req,res,next)=>{
    let doc = await modal.create(req.body);
    res.status(201).json({
        status:'success',
        data:{
            data:doc
        }
    });
});

exports.getAllDoc = modal =>catchAsync(async (req,res,next)=>{
    // make query
    let apiFeatures = new APIFeatures(modal.find(),req.query);
    apiFeatures.filtering().sort().select().pagination();
   
    // then await
    let doc = await apiFeatures.query;
    if(!doc) return next(new errClass('No document found!',404));
    res.status(200).json({
        status:'success',
        results:doc.length,
        data:{
            data:doc
        }
    });
});

exports.getOneDoc = modal =>catchAsync(async (req,res,next)=>{
    let doc = await modal.findById(req.params.id);
    if(!doc) return next(new errClass('No doc found!',404));

    res.status(200).json({
        status:'success',
        data:{
            data:doc
        }
    });
});

exports.updateDoc = modal => catchAsync(async (req,res,next)=>{
    let doc = await modal.findByIdAndUpdate(req.params.id,req.body,{
        runValidators:true,
        new:true
    });
    if(!doc) return next(new errClass('No doc found!',404));
    res.status(200).json({
        status:'success',
        data:{
            data:doc
        }
    });

});

exports.deleteDoc = modal =>catchAsync(async (req,res,next)=>{
    let doc = await modal.findByIdAndDelete(req.params.id);
    if(!doc) return next(new errClass('No doc found!',404));
    res.status(204).json({
        status:'success',
        data:null
    });
});




