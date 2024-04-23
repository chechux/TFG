const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get("/register",function(req,res,next){
  res.render("register")
})

router.get("/popupLogin",function(req,res,next){
  res.render("popuplogin")
})
module.exports = router;
