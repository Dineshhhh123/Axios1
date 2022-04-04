const Joi = require('@hapi/joi');
const boolean = require('@hapi/joi/lib/types/boolean');
const date = require('@hapi/joi/lib/types/date');
const authSchema = Joi.object({
    OfferName:  Joi.string().min(5).max(30).required(),
    CouponCode: Joi.string().min(4).max(10).required(),
    StartDate: Joi.date().required(),
    EndDate: Joi.date().required(),
    DiscountPercentage: Joi.number().min(1).max(100).required(),
    DiscountAmount: Joi.number().min(1).required(),
    TermsAndCondition:Joi.string().min(5).required(),
    OfferPosterOrImage:Joi.string().required(),
    subject:Joi.string().required(),
    to:Joi.string().required(),
    tml:Joi.string().required()
})

module.exports={
    authSchema
}