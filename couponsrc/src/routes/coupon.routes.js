const express = require('express');
const router  = express.Router();

const couponController = require('../controllers/coupon.controller.js');


router.post('/coupons', couponController.create);
router.post('/coupons/createwithuser', couponController.createWithUserId);
router.get('/coupons/couponwithuser/:_id', couponController.CouponWithUser);
router.get('/coupons', couponController.findAll);
router.get('/coupons/users', couponController.createTo);
router.get('/coupons/:Status/:StartDate', couponController.findByStatus);
router.get('/coupons/:OfferName', couponController.CouponValidation);
router.put('/coupons/:couponId', couponController.update);
router.delete('/coupons/:couponId', couponController.delete);
module.exports = router;