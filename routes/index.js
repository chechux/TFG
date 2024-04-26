const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const connection = require("../database/db")


/* GET home page. */
router.get('/', (req, res, next)=>{
  if(req.originalUrl === "/"){
    return res.redirect("/login")
  }
  next()
});


router.get("/register",(req,res,next)=>{
  res.render("register")
})

router.get("/popupLogin",(req,res,next)=>{
  res.render("popuplogin")
})

router.get("/main",(req,res,next)=>{
  res.render("main")
})

router.get("/login",(req,res,next)=>{
  res.render("login")
})

router.post("/register",async (req,res,next)=>{
    const username = req.body.username;
    const pass = req.body.pass;
    const gmail = req.body.gmail;
    const edad = req.body.edad;

    let passHaash=await bcryptjs.hash(pass, 8)
    if(0 < req.body.edad && req.body.edad < 18){
      res.render("register",{
        alert: true,
        alertTitle:"Menor de edad",
        alertMessage:"¡Hay que ser mayor de edad para entrar aqui!",
        alertIcon:"warning",
        showConfirmButton:true,
        timer:1500,
        ruta:"/localhost:3000"
      })

    
  }else if (req.body.edad <0){
    res.render("register",{
      alert: true,
      alertTitle:"edad negativa",
      alertMessage:"¡No puedes tener edad negativa!",
      alertIcon:"question",
      showConfirmButton:true,
      timer:3000,
      ruta:"/localhost:3000/register"
    })
  }else if(req.body.edad == 0){
    res.render("register",{
      alert: true,
      alertTitle:"0 años",
      alertMessage:"¡No puedes tener 0 años!",
      alertIcon:"question",
      showConfirmButton:true,
      timer:3000,
      ruta:"/localhost:3000/register"
    })
  }else{
    connection.query('INSERT INTO usuarios SET ?',{username:username, pass:passHaash, gmail:gmail, edad:edad},async(error,resutls)=>{
        
      res.render("register",{
        alert: true,
        alertTitle:"registrado",
        alertMessage:"¡Registrado correctamente!",
        alertIcon:"success",
        showConfirmButton:false,
        timer:3000,
        ruta:""
      })
    }
  )}
})



router.post("/login",async(req,res)=>{
  const username = req.body.username
  const pass = req.body.pass
  let passHaash = await bcryptjs.hash(pass, 8)
  if(username && pass){
    connection.query('SELECT * FROM usuarios WHERE username = ?',[username], async(error,resutls)=>{
      if(resutls.length == 0 || !(await bcryptjs.compare(pass, resutls[0].pass))){
        res.render("login",{
          alert: true,
          alertTitle:"Error",
          alertMessage:"¡usuario y/o contraseña incorrecta!",
          alertIcon:"error",
          showConfirmButton:false,
          timer:7500,
          ruta:""
        })
    }else{
      res.render("popuplogin",{
        alert: true,
        alertTitle:"Logueado",
        alertMessage:"¡Logueado correctamente!",
        alertIcon:"success",
        showConfirmButton:false,
        timer:2500,
        ruta:"/localhost:3000/main"
      })
  }})}
})



module.exports = router;
