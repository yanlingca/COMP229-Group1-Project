require('dotenv').config() //implement .env file
var express = require("express");
var User = require("../models/user")
var cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())
app.use(cookieParser())

const jwtSecret = process.env.JWT_SECRET;

//login
exports.login = async (req, res, next) => {
    const { email, password } = req.body
    // Check if email and password is provided
    if (!email || !password) {
        res.render("index", { title: "Login", login_message: "Please input email and Password", loggedIn: false});
    }
    try { //find the user by email
      const user = await User.findOne({ email })
      if (!user) {
        console.log("user not found");
        res.render("index", { title: "Login", login_message: "User not found", loggedIn: false});
      } else {
        // comparing given password with hashed password
        bcrypt.compare(password, user.password).then(function (result) {
            if (result) { //if password is matched, generate the token
              const maxAge = 3 * 60 * 60; //max age = 3 hrs
              const token = jwt.sign(
                { id: user._id, email },
                jwtSecret,
                {
                  expiresIn: maxAge, // 3hrs in sec
                }
              );
              res.cookie("jwt", token, { //store the token into cookies
                httpOnly: true,
                maxAge: maxAge * 1000,
              });
              res.redirect("/")
            } else {
                res.render("index", { title: "Login", login_message: "Incorrect Password.", loggedIn: false});
            }
          });
      }
    } catch (error) {
      res.status(400).json({
        message: "An error occurred",
        error: error.message,
      })
    }
  }

  //check authorization
  exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          //return res.status(401).json({ message: "Not authorized" })
          res.redirect("/users/login")
        }
        return next()
      })
    } else {
        res.redirect("/users/login")
    }
  }
 //check user logged in without further actions
  exports.checkLoggedIn = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                req.loggedIn = false
            }else{
            req.loggedIn = true
        }
        })
    }
    else{
        req.loggedIn = false
    }
    return next()
}