const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const connection = require("../database/db")
const Swal = require('sweetalert2')



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

router.get("/tablas",async(req,res,next)=>{
  const [fila] = await connection.query('SELECT * FROM listas')
  res.render("tablas",{fila})
})

router.get("/crearTabla",(req,res,next)=>{
  console.log("entra")
})

router.get("/register",(req,res,next)=>{
  res.redirect("/main")
})


router.get("/main", async (req,res,next)=>{
  const [producto] = await connection.query('SELECT * FROM productos')
  const [listas] = await connection.query('SELECT * FROM listas')
  res.render("main",{producto})
})




router.get("/editar/:id",async (req,res,next)=>{
  const {id} = req.params
  const [tabla] = await connection.query('SELECT * FROM listas WHERE id=?',[id])
  const [productos] = await connection.query('SELECT p.* FROM productos p INNER JOIN listas_productos lp ON p.id = lp.id_productos WHERE lp.id_lista =?',[id])
  res.render("edit",{tabla:tabla[0], productos})
  console.log(tabla)

})

router.post("/editar/:id",async(req,res,next)=>{
  const {id} = req.params
  const {nombre} = req.body
  const new_nombre ={nombre}
  await connection.query('UPDATE listas SET ? WHERE id =?',[new_nombre,id])
  res.redirect("/tablas")
})


router.get('/delete/:id', async (req, res) => {
  const {id} = req.params
  await connection.query('DELETE FROM listas WHERE id = ?', [id])
  res.redirect("/tablas")
})


router.get("/eliminarProducto/:id", async(req,res)=>{
  const {id} = req.params
  await connection.query('DELETE FROM listas_productos WHERE id=?',[id])
  res.redirect("/tablas")
})


router.get("/add/:id",async(req,res)=>{
  const id_producto = req.params.id;
  const [listas] = await connection.query('SELECT * FROM listas')
  // await connection.query('INSERT INTO listas_productos(id_productos) VALUES (?)',[id_producto])
  res.render("add",{listas,id_producto})

})

router.post("/add/:id",async(req,res,next)=>{
  const id_lista = req.params.id
  const id_producto = req.body.listas
  await connection.query('INSERT INTO listas_productos (id_lista, id_productos) VALUES (?,?)',[id_lista, id_producto])
  res.redirect("/main")

  
})


// listas.forEach(lista => {
  //   console.log(lista.id);
  // })





router.post('/register', async (req, res) => {

  const { username, pass, gmail, edad } = req.body;

  if(0 < req.body.edad && req.body.edad > 18){

    await connection.execute('INSERT INTO usuarios (username, pass, gmail, edad) VALUES (?, ?, ?, ?)', [username, pass,gmail,edad]);
    res.redirect("/main")
    
  }else{

    res.redirect("/")
  }
  
});

router.get("/login",(req,res,next)=>{
  res.render("login")
})

router.post('/login', async (req, res) => {
    const { username, pass } = req.body;
    const [producto] = await connection.query('SELECT * FROM productos')
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE username = ? AND pass = ?', [username, pass]);
    if (rows.length > 0) {
      res.redirect("/main")
    } else {
      res.redirect('/login?error=true')
    }
});
  

router.post("/crearTabla",async(req,res,next)=>{
  const nombre = req.body.nombre
  await connection.execute('INSERT INTO listas (nombre) VALUES (?)',[nombre])

  res.redirect("/tablas")
  console.log(nombre)
})


module.exports = router;
