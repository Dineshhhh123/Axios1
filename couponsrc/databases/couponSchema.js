const mongoose = require('mongoose');

const CouponSchema = mongoose.Schema({
    OfferName:String,
    CouponCode:String,
    StartDate:Date,
    EndDate:Date,
    DiscountPercentage:Number,
    DiscountAmount:Number,
    TermsAndCondition:String,
    OfferPosterOrImage:String,
    Status:String,

}, {
    timestamps: true
});

 module.exports=mongoose.model('Coupon',CouponSchema);