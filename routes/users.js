var express = require("express");
var router = express.Router();

var User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { login, checkLoggedIn, registration } = require("../middleware/auth");

/*GET registration page*/
router.get("/registration", function (req, res, next) {
  res.cookie("jwt", "", { maxAge: "1" });
  res.render("index", {
    title: "Registration",
    reg_message: "",
    loggedIn: false,
  });
});

//Handling user registration
router.route("/registration").post(registration);

/*GET login page*/
router.get("/login", checkLoggedIn, function (req, res, next) {
  res.cookie("jwt", "", { maxAge: "1" });
  res.render("index", { title: "Login", login_message: "", loggedIn: false });
});

//Handling user login
router.route("/login").post(login);

//Handling user logout
router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});

module.exports = router;
