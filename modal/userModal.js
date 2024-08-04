const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please tell us your name.'],
        unique:true
    },
    email:{
        type:String,
        required:[true,'User must have an email'],
        unique:true,
        lowercase:true,
        validate:{
            validator:function(val){
                return val.indexOf('@') > -1;
            },
            message:'Please provide valid email'
        }
    },
    password:{
        type:String,
        required:[true,'User must have password'],
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'User must have passwordConfirm'],
        

    },
    role:{
        type:String,
        enum:{
            values:['user','guide','admin'],
            message:'Your role must be "guide" or "user" or "admin"',
        },
        default:'user'
    },
    active:{
        type:Boolean,
        default:true
    },
    progress:{
        type:Object,
    },

    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordTimeExpire:Date

   
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

// hashing middle
userSchema.pre('save',async function(next){
    // if(!this.isModified('password')) return next();
    // this.password = await bcrypt.hash(this.password,12);
    // this.passwordConfirm = undefined;
    // console.log(this.passwordChangedAt);
    next();
});
// passwordChangeAt puting value
userSchema.pre("save", function(next){
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
userSchema.pre("save", async function(next){
    // let tour = this.tour.map(async val => await Tour.findById(val));
    // this.tour = await Promise.all(tour);
    next();
});


// instans metheods
userSchema.methods.comparePassword = async (userPass,hashPass)=>{
    // return await bcrypt.compare(userPass,hashPass);
    return  userPass===hashPass;
}
// check token and password dates
userSchema.methods.passwordChange =  function(JWTTime){
    if(this.passwordChangedAt){
        let time = parseInt(this.passwordChangedAt.getTime()/1000);
        return JWTTime < time;
    }
    return false;
}
// random byets in forgetPassword
userSchema.methods.randomString = function(){
    let stringToken = crypto.randomBytes(32).toString('hex');
    let hashToken = crypto.createHash('sha256').update(stringToken).digest('hex');
    // set hasToken in DB
    this.passwordResetToken = hashToken;
    this.passwordTimeExpire = Date.now()+(10*60*1000);
    return stringToken;
}
// query middle

userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next();
});





let userModal = mongoose.model('User',userSchema);
module.exports = userModal;



