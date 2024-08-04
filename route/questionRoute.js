const express = require('express');
const multer = require('multer')();
const questionControler = require('./../controler/questionControler');
const authControler = require('./../controler/authControler');
const router = express.Router();



router.route('/')
.get(questionControler.getAllQuestion)
router.route('/:id')
.get(questionControler.getOneQuestion)

// CRUD
// only admin can access
router.use(authControler.protect,authControler.restrictTo('admin'));
router.route('/')
.post(questionControler.createQuestion);

router.route('/:id')
.patch(questionControler.updateQuestion)
.delete(questionControler.deleteQuestion);




module.exports = router;



