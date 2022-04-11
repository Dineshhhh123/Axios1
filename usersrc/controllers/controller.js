'use strict';
var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  User = mongoose.model('User');
const { authSchema } = require('../models/validate')
const axios = require('axios');
require('dotenv').config();

exports.register = async function (req, res) {
  try {
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    const result = await authSchema.validateAsync(req.body)
    console.log(result)
    User.findOne({
      email: req.body.email
    }, function (err, user) {
      if (err) throw err;
      if (!user || !user.compareEmail(req.body.email)) {
        newUser.save(function (err, user) {
          if (err) {
            
            return res.status(400).json({
              message:err
            });
          } else {
            user.hash_password = undefined;
            res.json(jwt.sign({ email: user.email, fullName: user.fullName,_id:user._id}, 'RESTFULAPIs') );
          }
      });
    }
      else{
        return res.status(401).json({ message: 'mail already exist' });

      }
    });
  
   /* newUser.save(function (error, user) {
      if (error) {
        
        return res.status(400).json({
          message:"mail already exist"
        });
      } else {
        user.hash_password = undefined;
        return res.json(user);
      }
    });*/
  }
   catch (error) {
    res.status(409).json({ message: error?.message || error })
  }
};

exports.sign_in = function (req, res) {
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
    }
    return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTFULAPIs') });
  });
};

exports.loginRequired = function (req, res, next) {
  if (req.user) {
    next();
  } else {

    return res.status(401).json({ message: 'Unauthorized user!!' });
  }
};
exports.profile = function (req, res, next) {
  if (req.user) {
    res.send(req.user);
    next();
  }
  else {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
exports.findAll = (req, res) => {
  User.find({}).sort({_id:-1})
  .then(user => {
      res.send(user);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving user details."
      });
  });
};
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


exports.findByUserId = (req, res) => {
  User.findOne({_id:req.params._id})
  .then(coupon => {
      res.send(coupon);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving coupon details."
      });
  });
};