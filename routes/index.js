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
      if(req.body.edad < 18){
        res.render("index",{
          alert: true,
          alertTitle:"Menor de edad",
          alertMessage:"¡Hay que ser mayor de edad para entrar aqui!",
          alertIcon:"warning",
          showConfirmButton:true,
          timer:3000,
          ruta:""
        })
      }else{
        res.render("register",{
          alert: true,
          alertTitle:"registrado",
          alertMessage:"¡Registrado correctamente!",
          alertIcon:"success",
          showConfirmButton:false,
          timer:2000,
          ruta:""
        })
      }
    })
})

router.post("/",async(req,res)=>{
  const user = req.body.user
  const pass = req.body.pass
  let passHaash = await bcryptjs.hash(pass, 8)
  if(user && pass){
    connection.query('SELECT * FROM usuarios WHERE username = ?',[user], async(error,resutls)=>{
      if(resutls.length == 0 || !(await bcryptjs.compare(pass, resutls[0].pass))){
        res.send("usuario o password incorrecta")
      }else{
        res.send("login correcto")
      }
    })
  }
})



module.exports = router;
