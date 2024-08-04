// native module
const path = require("path");
// npm module
const express = require("express");
const morgan = require("morgan");
const app = express();
const cookieParser = require('cookie-parser');
const BodyParser = require('body-parser');
const User = require('./modal/userModal');

// My module
const userRoute = require("./route/userRoute");
const questionRoute = require("./route/questionRoute");

// err controler
const errorClass = require("./utils/errorClass");
const errControler = require("./controler/errorControler");


// // ###########  Middleware  ##############
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use((req, res, next) => {
 
    // res.append('Access-Control-Allow-Origin','chrome-extension://donaljnlmapmngakoipdmehbfcioahhk');
    // res.header('Access-Control-Allow-Origin', req.headers.origin);
    // res.append('Access-Control-Allow-Origin','http://192.168.173.1:3000');
    // res.append('Access-Control-Allow-Origin','http://192.168.137.1:8181');
    res.append('Access-Control-Allow-Headers', '*');
    res.append('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,HEAD');
    res.append('Access-Control-Allow-Credentials', true);
    
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (req.method === 'OPTIONS') {
      return res.status(200).end(); // Handle OPTIONS request
    }
    next();
});

// *********************** Youtube Route ***************************
app.use("/api/v1/userRoute", userRoute);
app.use("/api/v1/questionRoute", questionRoute);

// Error handler and 404
app.all("*", (req, res, next) => {
  next(new errorClass("Not found!", 404));
});
app.use(errControler);

// create default admin
const createAdmin = async ()=>{
  let doc = await User.findOne({role:'admin'});
  if(!doc){
    let user = await User.create({name:'admin',role:'admin',email:'admin@gmail.com',password:'123456789',passwordConfirm:'123456789'});
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
        _id: user._id
      }
      console.log("Created new Admin",newUser);
  }else{
    console.log("Admin Already exists");
  }

  
}
createAdmin();

module.exports = app;
