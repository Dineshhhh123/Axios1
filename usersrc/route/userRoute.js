const express = require('express');
const router  = express.Router();

const couponController = require('../controllers/controller.js');


router.post('/register', couponController.register);
router.post('/login', couponController.sign_in);
router.get('/users', couponController.findAll);
router.get('/users/:_id', couponController.findByUserId);
module.exports = router;