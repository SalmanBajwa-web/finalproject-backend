const errorClass = require('../utils/errorClass');
function devHandle(err,res){
    console.log('devHandle');
    console.log({
        name:err.name,
        status:err.status,
        message:err.message,
        errStack:err.stack,
        err:err
    });
    res.status(err.statusCode).json({
        name:err.name,
        status:err.status,
        message:err.message,
        errStack:err.stack,
        err:err
    });
}

function prodHandle(err,res){
    console.log('prodHandle');
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        });
    }else{
       console.log('************ Not Operational Error **************');
       console.log(
        {
            name:err.name,
            status:err.status,
            message:err.message,
            errStack:err.stack,
            err:err
        }
       );
       console.log('************ Not Operational Error **************');

       res.status(500).json({
       status:'fail',
       message:'Something went wrong!',
    //    err:{
    //     name:err.name,
    //     status:err.status,
    //     message:err.message,
    //     errStack:err.stack,
    //     err:err
    //    }
    });
    }

}
function handleDublicateDB(err){
    return new errorClass(`Dublicate key '${Object.keys(err.keyValue)[0]} = ${err.keyValue.name}'.Please choose other value. `,400);
}
function handleCastErrorDB(err){
    return new errorClass(`This is invalid at ${err.path} code ${err.value} `,400);
}
function handleValidationDB(err){
    let error = Object.values(err.errors).map(item=> item.message);
    return new errorClass(`Invalid data set ${error.join(', ')}`,400);
}
function handleJWTInvalidToken(err){
    return new errorClass(`Invalid token.Please login again to access this rute.`,401);
}
function handleJWTExpireToken(err){
    return new errorClass(`Your token is expired.Please login again to access this rute.`,401);
}

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        devHandle(err,res);
    }else if(process.env.NODE_ENV === 'production'){
        let error = Object.create(err,{});
        if(error.code === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDublicateDB(error);
        if(error.name === 'ValidationError') error = handleValidationDB(error);
        if(error.name === 'JsonWebTokenError') error = handleJWTInvalidToken(error);
        if(error.name === 'TokenExpiredError') error = handleJWTExpireToken(error);
        prodHandle(error,res);
    }
}