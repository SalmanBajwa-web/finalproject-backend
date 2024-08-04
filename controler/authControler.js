const crypto = require('crypto');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');

const catchAsync = require('./../utils/catchAsync');
const errorClass = require('./../utils/errorClass');
const User = require('./../modal/userModal');

// const Folder = require('./../modal/folderModal');

function signToken(id){
    let token = jwt.sign({id},process.env.JWT_PASSWORD,{expiresIn:process.env.JWT_EXPIRES_IN});
    return token;
}
function sendRes(user,code,res){
    let token = signToken(user._id);


    // let cookieParams = {
    //     expires:new Date(Date.now()+process.env.COOKIE_EXPIRES*24*60*60*1000),
    //     // httpOnly:true
    // };
    // if(process.env.NODE_ENV === 'production') cookieParams.secure = true;
    // res.cookie('jwt',token,cookieParams);
    res.set("Authorization", `Bearer ${token}`);

    res.status(code).json({
        status:'success',
        token,
        data:{
            data:user
        }
    })
}


exports.signUp = catchAsync(async (req,res,next)=>{
    console.log("req.body :",req.body);

    let {name,email,password,passwordConfirm} =  req.body;
    let user = await User.create({name,email,password,passwordConfirm});
    // create user home folder
    // isHome = await Folder.create({
    //     name:'Home',
    //     img:[],
    //     folder:[],
    //     owner:user._id,
    //     isHome:true,
    // });

    let newUser = {
        active: user.active,
        email: user.email,
        name: user.name,
        role: user.role,
        progress:user.progress,
        _id: user._id
      }
    sendRes(newUser,201,res);
});

exports.logIn = catchAsync(async (req,res,next)=>{
    // 1) name and password exists
    let {email,password} = req.body;
    
    if(!email || !password) return next(new errorClass('Please provide user email and password!',400));
    // 2)user still exists
    let user = await User.findOne({email}).select('+password');
    console.log("user",user);
    console.log("Compare",await user.comparePassword(password,user.password));
    // 3)compare password with original password
    if(!user || !(await user.comparePassword(password,user.password))){
        return next(new errorClass('Email or Password is incorrect!',401));
    }
    // 4)send token and res
      let newUser = {
        active: user.active,
        email: user.email,
        name: user.name,
        role: user.role,
        password:user.password,
        progress:user.progress,
        _id: user._id,
      }

    
    sendRes(newUser,200,res);

});

exports.protect = catchAsync(async (req,res,next)=>{
    // console.log('Req :',req.cookies);
    const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    req.token = token;
  }
    // 1)check token presetn start with Bearer
    let token;
    if(authHeader && req.token){
        token = req.token;
    }
    
    // console.log(req.cookies);

    if(!token) return next(new errorClass('You are not login.Please login to access this route',401));
    // 2)jwt verify token two err expire token or token err
    let tokenVari = await promisify(jwt.verify)(token,process.env.JWT_PASSWORD);
    // 3)user still exists
    let user = await User.findById(tokenVari.id);
    console.log("tokenVari :",tokenVari);
    console.log("user :",user);
    if(!user) return next(new errorClass('User beloging to this token no longer exists.',401));
    // 4)user not change password
    if(user.passwordChange(tokenVari.iat)){
        return next(new errorClass('User has recently changed password.',401));
    }
    req.user = user;
    next();
});

exports.restrictTo = (...role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role)){
            return next(new errorClass('You do not have premission to access this route.',401));
        }
        next();
    }
}
exports.forgetPassword = catchAsync(
    async (req,res,next)=>{
        // 1) user exists with this emial
            let user  = await User.findOne({email:req.body.email});
            if(!user) return next(new errorClass('No user exists with this email.',400));
        // 2)create random string hashed save in DB other send as emil
            let randomToken = user.randomString();
            await user.save({validateBeforeSave:false});
        // 3) some went wrong passwordRest to undefinded and passwordTimeExpire = undefinded

        try{
            console.log(`${req.protocol}://${req.hostname}/api/v1/user/${randomToken}`);
            res.status(200).json({
                status:"success",
                message:'Token sent by email'
            });
    
        }catch{
            user.passwordResetToken = undefined;
            user.passwordTimeExpire = undefined;
            await user.save({validateBeforeSave:false});
            return next(errorClass("Someting went wrong.Please again try latter.",500));
        }
});
exports.resetPassword = catchAsync(async (req,res,next)=>{
    let tokenString = req.params.token;
    let hashToken = crypto.createHash('sha256').update(tokenString).digest('hex');
    let user = await User.findOne({passwordResetToken:hashToken,passwordTimeExpire:{$gt:Date.now()}});
    if(!user) return next(new errorClass('Your token invalid or expired!',401));
    // if ok
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordTimeExpire = undefined;
    await user.save();
    
    sendRes(user,200,res);
});

exports.updateMyPassword = catchAsync(async (req,res,next)=>{
        let currentPassowrd = req.body.currentPassword || '';
    // 1) find user in req.user not contain password ask also +password explicitively
        let user = await User.findById(req.user._id).select('+password');
    // 2)check password compare currentPassword userPassword
        if(!(await user.comparePassword(currentPassowrd,user.password))){
            return next(new errorClass('Your currentPassowrd incorrect!',401));        
        }
    // 3)send res
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        sendRes(user,200,res);
});

// function filterObj(body,...fields){
//     let obj = {};
//     Object.keys(body).forEach(item=>{
//         if(fields.includes(item)){
//             obj[item] = body[item];
//         }
//     });
//     return obj;
// }

exports.updateMe = catchAsync(async (req,res,next)=>{
    // if password or passwordConfirm contans in req.body
    // if(req.body.passwordConfirm || req.body.password){
    //     return next(new errorClass('This route is not for password updates.Please visit /updateMyPassword'),400);
    // }
    // filter req.body only email and name
    // let obj = filterObj(req.body,'email','name');
    let user = await User.findByIdAndUpdate(req.user._id,req.body,{
        new:true,
        runValidators:true
    });
    sendRes(user,200,res);
});

exports.aboutMe = catchAsync(async (req,res,next)=>{
    req.params.id = req.user._id;
    next();
});

exports.deleteMe = catchAsync(async (req,res,next)=>{
    let user = await User.findByIdAndUpdate(req.user._id,{active:false});
    res.status(204).json({
        status:"success",
        data:null
    });
});

exports.logOut = catchAsync(async (req,res,next)=>{
    let cookieParams = {
        expires:new Date(Date.now()),
        httpOnly:true
    };
    // if(process.env.NODE_ENV === 'production') cookieParams.secure = true;
    res.cookie('jwt','',cookieParams);

    res.status(200).json({
        status:"success",
        data:null
    });
});

