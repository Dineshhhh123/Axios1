const { authSchema } = require('../validator/validate');
const sendMailMethod = require("../mailService/mail");
const Coupon=require('../databases/couponSchema');


exports.create = async(req, res) => {
try{
const result = await authSchema.validateAsync(req.body);
const mailbox = await sendMailMethod(req.body);

Coupon.findById(req.body.OfferName, (err, data) => {
  

    if (!data) {
        var currentStatus;
        var currentDate=new Date().getTime()
        var dateOne = new Date(req.body.EndDate).getTime();
        if (currentDate < dateOne) {
            currentStatus = "Active";
        } else {    
            currentStatus = "Inactive";    
        }
    const coupon = new Coupon({
    OfferName:req.body.OfferName,
    CouponCode:req.body.CouponCode,
    StartDate:req.body.StartDate,
    EndDate:req.body.EndDate,
    DiscountPercentage:req.body.DiscountPercentage,
    DiscountAmount:req.body.DiscountAmount,
    TermsAndCondition:req.body.TermsAndCondition,
    OfferPosterOrImage:req.body.OfferPosterOrImage,
    Status:currentStatus
});


coupon.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the Coupon."
    });
});

}})
}catch(error) {
    res.status(409).json({ message: error?.message || error })
  }
};


exports.findAll = (req, res) => {
    Coupon.find({}).sort({_id:-1})
    .then(coupon => {
        res.send(coupon);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving coupon details."
        });
    });
};
exports.findByStatus = (req, res) => {
    Coupon.find({Status:req.params.Status,StartDate:req.params.StartDate})
    .then(coupon => {
        res.send(coupon);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving coupon details."
        });
    });
};
exports.CouponValidation = (req, res) => {
    Coupon.find({OfferName:req.params.OfferName})
    .then(coupon => {
        var now = new Date().getTime();
        coupon.map((getcoupon)=>{
            if(now>new Date(getcoupon.StartDate).getTime()&&now<new Date(getcoupon.EndDate).getTime()){
                res.send("entered coupon is valid");

            }else{
                res.send("entered coupon is out of date")
            }
        })
        
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving coupon details."
        });
    });
};




exports.update = (req, res) => {
    if(!req.body.OfferName) {
        return res.status(400).send({
            message: "Offer Name can not be empty"
        });
    }

    
    Coupon.findByIdAndUpdate(req.params.couponId, {
        OfferName:req.body.OfferName,
        CouponCode:req.body.CouponCode,
        StartDate:req.body.StartDate,
        EndDate:req.body.EndDate,
        DiscountPercentage:req.body.DiscountPercentage,
        DiscountAmount:req.body.DiscountAmount,
        TermsAndCondition:req.body.TermsAndCondition,
        OfferPosterOrImage:req.body.OfferPosterOrImage,
        Status:req.body.Status
    }, {new: true})
    .then(coupon => {
        if(!coupon) {
            return res.status(404).send({
                message: "Coupon not found with id " + req.params.couponId
            });
        }
        res.send(coupon);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Coupon not found with id " + req.params.couponId
            });                
        }
        return res.status(500).send({
            message: "Error updating Coupon with id " + req.params.couponId
        });
    });
};



exports.delete = (req, res) => {
    Coupon.findByIdAndRemove(req.params.couponId)
    .then(coupon => {
        if(!coupon) {
            return res.status(404).send({
                message: "Coupon not found with id " + req.params.couponId
            });
        }
        res.send({message: "Coupon deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Coupon not found with id " + req.params.couponId
            });                
        }
        return res.status(500).send({
            message: "Could not delete coupon with id " + req.params.couponId
        });
    });
};

