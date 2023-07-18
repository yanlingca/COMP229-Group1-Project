var express = require('express');
var router = express.Router();

var User = require('../models/user');
const mongoose = require("mongoose");
const bcrypt= require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*GET registration page*/
router.get("/registration", function (req, res, next) {
  res.render("index", { title: "Registration", reg_message: ""});
});

/*POST create new user*/
router.post("/registration", async (req, res, next) =>{
  const hashedPassword = await bcrypt.hash(req.body.password,10);
  const user = new User({
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email,
    password : hashedPassword
  })
    try {
      const newUser = await user.save();
      res.redirect('../');
    } catch (err) {
      res.render("index", { title: "Registration", reg_message: "Failed to register. Please try again!"});
      console.log(err.message);
    }
});

module.exports = router;
