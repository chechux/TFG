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

router.get("/popuplogin",(req,res,next)=>{
  console.log("entra")
})

router.get("/popupRegister",(req,res,next)=>{
  console.log("entra")
})

router.get("/register",(req,res,next)=>{
  res.render("register")
})

router.get("/tablas",async(req,res,next)=>{
  const [fila] = await connection.query('SELECT * FROM listas')
  res.render("tablas",{fila})
})

router.get("/crearTabla",(req,res,next)=>{
  console.log("entra")
})



router.get("/main", async (req,res,next)=>{
  const [producto] = await connection.query('SELECT * FROM productos')
  res.render("main",{producto})
  console.log(producto)
})


router.get("/login",(req,res,next)=>{
  res.render("login")
})



router.post('/register', async (req, res) => {

  const { username, pass, gmail, edad } = req.body;

  

  if(0 < req.body.edad && req.body.edad > 18){
    res.redirect("/main");
    const [result] = await connection.execute('INSERT INTO usuarios (username, pass, gmail, edad) VALUES (?, ?, ?, ?)', [username, pass,gmail,edad]);
    
    
  }else{
    res.redirect("/")
  }
  
});



router.post('/login', async (req, res) => {
    const { username, pass } = req.body;
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE username = ? AND pass = ?', [username, pass]);

    if (rows.length > 0) {
        res.redirect("/main");
        console.log("logueado")
    } else {
        res.render("login");
        console.log("no logueado")
    }
});
  

router.post("/crearTabla",async(req,res,next)=>{
  const nombre = req.body.nombre
  await connection.execute('INSERT INTO listas (nombre) VALUES (?)',[nombre])

  res.redirect("/tablas")
  console.log(nombre)
})


module.exports = router;
