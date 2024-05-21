const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const connection = require("../database/db")



/* GET home page. */
router.get('/', (req, res, next)=>{
  if(req.originalUrl === "/"){
    return res.redirect("/login")
  }
  next()
});




router.get("/crearTabla",(req,res,next)=>{
  console.log("entra")
})



router.get("/main", async (req,res,next)=>{
  const [producto] = await connection.query('SELECT * FROM productos')
  res.render("main",{producto})
})




router.get("/editar/:id",async (req,res,next)=>{
  const {id} = req.params
  const [tabla] = await connection.query('SELECT * FROM listas WHERE id=?',[id])
  const [productos] = await connection.query('SELECT p.* FROM productos p INNER JOIN listas_productos lp ON p.id = lp.id_productos WHERE lp.id_lista =?',[id])
  res.render("edit",{tabla:tabla[0], productos,})

})

router.post("/editar/:id",async(req,res,next)=>{
  const {id} = req.params
  const {nombre} = req.body
  const new_nombre ={nombre}
  const id_producto = req.body.listas
  await connection.query('UPDATE listas SET ? WHERE id =?',[new_nombre,id])
  await connection.query('DELETE FROM listas_productos WHERE id_productos = ?',[id_producto])
  res.redirect("/tablas")

})


router.get('/delete/:id', async (req, res) => {
  const {id} = req.params
  await connection.query('DELETE FROM listas_productos WHERE id_lista = ?',[id])
  await connection.query('DELETE FROM listas WHERE id = ?', [id])
  res.redirect("/tablas")
})


router.get("/add/:id",async(req,res)=>{
  const id_producto = req.params.id;
  const [listas] = await connection.query('SELECT * FROM listas')
  await connection.query('INSERT INTO listas_productos(id_productos) VALUES (?)',[id_producto])
  res.render("add",{listas,id_producto})

})

router.post("/add/:id",async(req,res,next)=>{
  const id_lista = req.params.id
  const id_producto = req.body.listas
  await connection.query('INSERT INTO listas_productos (id_lista, id_productos) VALUES (?,?)',[id_lista, id_producto])
  res.redirect("/main")

  
})


router.post('/register', async (req, res) => {

  const { username, password,gmail,edad } = req.body;

  await connection.query('INSERT INTO usuarios (username, password,gmail,edad) VALUES (?, ?, ?, ?)', [username, password, gmail, edad])
    res.redirect('/login');
  });

router.get("/login",(req,res,next)=>{
  res.render("login")
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      const user = rows[0]
      req.session.userId = user.id
      console.log(req.session.userId)
      res.redirect("/main")
    } else {
        res.render('login', { message: 'Invalid credentials' });
        console.log("hola")
      }
  });
  




router.get("/tablas",async(req,res,next)=>{
    if (!req.session.userId) {
      return res.redirect('/login');
    }
  
     const [results] = await connection.query('SELECT * FROM listas WHERE id_usuario = ?', [req.session.userId])
     for (let tabla of results ){
      const [productos] = await connection.query('SELECT p.precio FROM productos p JOIN listas_productos tp ON p.id = tp.id_productos WHERE tp.id_lista =? ',[tabla.id])
      tabla.totalprecio = productos.reduce((acc,producto)=> acc + parseFloat(producto.precio), 0)
     }
      res.render('tablas', { listas : results });
    });

router.post("/crearTabla",async(req,res,next)=>{
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const { nombre } = req.body;

  await connection.query('INSERT INTO listas (id_usuario, nombre) VALUES (?, ?)', [req.session.userId, nombre])
    res.redirect('/tablas');
  });


module.exports = router;
