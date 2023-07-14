var express = require('express');
var router = express.Router();
var Log = require('../models/log');

/* GET home page. */
router.get('/', async(req, res, next)=> {
  try{
    let logs = await Log.find().sort('CreatedDate');
    res.render('index', { title: 'Home', logs: logs});
  }catch(err){
    res.status(500).json({message:err.message});
  }
});

/*GET Add new log page*/
router.get('/add', function(req,res,next) {
  res.render('add',{title: 'Add New Log'});
})

/*POST Add new log page*/
router.post("/add", async(req, res, next) =>{
  let log = new Log({
    LogNo: req.body.LogNo,
    CreatedDate: req.body.CreatedDate,
    ItemDesc: req.body.ItemDesc,
    TurnedInBy: req.body.TurnedInBy
  })
  try{
    let newLog = await log.save();
    res.redirect('/');
  }catch(err){
    res.status(500).json({message:err.message});
  }
})

module.exports = router;
