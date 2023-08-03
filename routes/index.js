var express = require("express");
var router = express.Router();
var Log = require("../models/log");
const mongoose = require("mongoose");
const {checkLoggedIn} = require("../middleware/auth");

/* GET home page. */
router.get("/", checkLoggedIn, async (req, res, next) => {
  try {
    let logs = await Log.find().sort("CreatedDate");
    res.render("index", { title: "Home", logs: logs, loggedIn: req.loggedIn });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*GET Add new log page*/
router.get("/add", checkLoggedIn, function (req, res, next) {
  res.render("index", { title: "Add New Log", loggedIn: req.loggedIn });
});

/*POST Add new log page*/
router.post("/add", async (req, res, next) => {
  let log = new Log({
    LogNo: req.body.LogNo,
    CreatedDate: req.body.CreatedDate,
    ItemDesc: req.body.ItemDesc,
    TurnedInBy: req.body.TurnedInBy,
  });
  try {
    let newLog = await log.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET Edit log page. */
router.get("/update/:id", checkLoggedIn, async (req, res) => {
  try {
    //if not login, redirect to login page
    if (!req.loggedIn){
      res.redirect("/users/login");
    }
    else{
      const logID = req.params.id;
      //Retrieve the log from the database based on the ID
      const log = await Log.findById(logID);
      if (log) {
        res.render("index", { title: "UPDATE LOG", log, loggedIn: req.loggedIn });
      } else {
        // If the log is not found, redirect back to the home page
        res.redirect("/");
      }
    }
  } catch (error) {
    //Handle any errors and redirect to an error page or show an error message
    res.status(500).json({ message: error.message });
  }
});

/* POST Edit log page - Update a log. */
router.post("/update/:id",checkLoggedIn, async (req, res) => {
  try {
    //if not login, response 401 error
    if (!req.loggedIn){
      res.status(401).json({ message: "Login is required" });
    }else{
      const logID = req.params.id;
      const {
        LogNo,
        CreatedDate,
        ItemDesc,
        TurnedInBy,
        ClaimedBy,
        Phone,
        ReleasedBy,
        DateReleased,
      } = req.body;

      // Validate if the log ID is valid
      if (!mongoose.Types.ObjectId.isValid(logID)) {
        throw new Error("Invalid log ID");
      }

      // Retrieve the log from the database based on the ID
      const log = await Log.findById(logID);

      if (!log) {
        throw new Error("Log not found");
      }

      // Update the log properties
      log.LogNo = LogNo;
      log.CreatedDate = CreatedDate;
      log.ItemDesc = ItemDesc;
      log.TurnedInBy = TurnedInBy;
      log.ClaimedBy = ClaimedBy;
      log.Phone = Phone;
      log.ReleasedBy = ReleasedBy;
      log.DateReleased = DateReleased;

      // Save the updated log
      const updatedLog = await log.save();
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

/* POST Edit log page - Delete a log. */
router.post("/delete/:id", checkLoggedIn, async (req, res) => {
  try {
    //if not login, response 401 error
    if (!req.loggedIn){
      res.status(401).json({ message: "Login is required" });
    }else{
      const logID = req.params.id;
      // Validate if the log ID is valid
      if (!mongoose.Types.ObjectId.isValid(logID)) {
        throw new Error("Invalid log ID");
      }

      // Find the log in the database by ID and delete it
      const deletedLog = await Log.findByIdAndDelete(logID);

      //error handling
      if (!deletedLog) {
        throw new Error("Log not found");
      }
      res.json({ message: "Log deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
