const { authSchema } = require('../validator/validate');
const sendMailMethod = require("../mailService/mail");
const axios = require('axios');
const Coupon=require('../databases/couponSchema');
const jwt = require('jsonwebtoken')
require('dotenv').config();


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
exports.createWithUserId = async(req, res) => {
    try{
    
    Coupon.findById(req.body.OfferName, (err, data) => {
      
    
        if (!data) {
            axios.post("http://localhost:3001/register", {
            email: req.body.email,
            password: req.body.password,
            fullName: req.body.fullName
            }).then(function(response) {
            var decoded=jwt.decode(response.data);
            var userId=decoded._id;
                console.log(decoded._id);
            
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
        Status:currentStatus,
        userId:userId
    });
    coupon.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Coupon."
        });
    });
}) 
    }})
    }catch(error) {
        res.status(409).json({ message: error?.message || error })
        console.log(error);
      }
    };
    
exports.CouponWithUser = (req, res) => {
        Coupon.findOne({_id:req.params._id,StartDate:{$lte:new Date()},EndDate: {$gte: new Date()}}).then(coupon => {
                    var id=coupon.userId;
                    axios.get(`http://localhost:3001/users/${id}`, {
                    
                 }).then(response=>{
                    let user=response.data;
                    res.json({
                        coupon,
                        user
                    })
                    })
                 }).catch(err => {
            res.status(500).send({
                message: "out of date"
            });
        });
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
exports.usercoupon=async(req,res)=> {
    try {
        
        Coupon.find({_id:req.params._id})
        .then(coupon => {
            var id=coupon.userId;
            console.log(id);
            let response = axios({
                method: "GET",
                url: `http://localhost:3001/users/${id}`,
                headers: {
                    contentType: "application/json",
                }
            })
                    
                res.json({coupon})

        })
    
    } 
    catch(error){
        res.status(400).json({
            message:error
        })
        console.log(error)
    }
  }
exports.createTo=async(req,res)=> {
    try {
        let response = await axios({
            method: "GET",
            url: process.env.GET_ID,
            headers: {
                contentType: "application/json",
            }
        })
        return res.status(200).send({ 
            response:response.data
        })
    } 
    catch(error){
        res.status(400).json({
            message:error
        })
        console.log(error)
    }
  }
  exports.getToken=async(req,res)=> {
    try {
        axios.post("http://localhost:3001/register", {
        email: req.body.email,
        password: req.body.password,
        fullName: req.body.fullName
    }).then(function(response) {
    console.log(response.data);
    var decoded=jwt.decode(response.data);
     console.log(decoded._id);
    }).catch(function(error) {
    console.log(error)
    })
    } 
    catch(error){
        res.status(400).json({
            message:error
        })
        console.log(error)
    }
  }

