const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const connection = require("../database/db")


/* GET home page. */
router.get('/', (req, res, next)=>{
  res.render('index');
});


router.get("/register",(req,res,next)=>{
  res.render("register")
})

router.get("/popupLogin",(req,res,next)=>{
  res.render("popuplogin")
})

router.post("/register",async (req,res,next)=>{
    const username = req.body.username;
    const pass = req.body.pass;
    const gmail = req.body.gmail;
    const edad = req.body.edad;

    let passHaash=await bcryptjs.hash(pass, 8)
    connection.query('INSERT INTO usuarios SET ?',{username:username, pass:passHaash, gmail:gmail, edad:edad},async(error,resutls)=>{
      if(error){
        console.log(error)
      }else{
        res.render("register",{
          alert
        })
      }
    })
})
module.exports = router;
