const express = require('express');
const multer = require('multer')();
const userControler = require('./../controler/userControler');
const authControler = require('./../controler/authControler');
const router = express.Router();

// signIn
router.post('/signUp',authControler.signUp);
// logIn
router.post('/logIn',authControler.logIn);
// forgetPassword
router.post('/forgetPassword',authControler.forgetPassword);
// resetPassword
router.patch('/resetPassword/:token',authControler.resetPassword);
// updateMyPassword
router.patch('/updateMyPassword',authControler.protect,authControler.updateMyPassword);
// updateMyPassword
router.patch('/updateMe',authControler.protect,authControler.updateMe);
// aboutMe
router.get('/aboutMe',authControler.protect,authControler.aboutMe,userControler.getOneUser);
// deleteMe
router.delete('/deleteMe',authControler.protect,authControler.deleteMe);
// logOut
router.get('/logOut',authControler.protect,authControler.logOut);



// CRUD
// only admin can access
router.use(authControler.protect,authControler.restrictTo('admin'));
router.route('/')
.get(userControler.getAllUser)
.post(userControler.createUser);

router.route('/:id')
.get(userControler.getOneUser)
.patch(userControler.updateUser)
.delete(userControler.deleteUser);




module.exports = router;



