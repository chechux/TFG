const express = require('express');
const router = express.Router();
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
  console.log(productos)
  res.render("edit",{tabla:tabla[0], productos})

})

router.post("/editar/:id",async(req,res,next)=>{
  const {id} = req.params
  const {nombre} = req.body
  const new_nombre ={nombre}
  const id_producto = req.body.listas
  console.log(req.params)
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
  const [results] = await connection.query('SELECT * FROM listas WHERE id_usuario = ?', [req.session.userId])
  res.render("add",{results,id_producto})

})

router.post("/add/:id",async(req,res,next)=>{
  const id_lista = req.params.id
  const id_producto = req.body.listas
  await connection.query('INSERT INTO listas_productos (id_lista, id_productos) VALUES (?,?)',[id_lista, id_producto])
  res.redirect("/main")

  
})


router.get("/tablas",async(req,res,next)=>{
     const [results] = await connection.query('SELECT * FROM listas WHERE id_usuario = ?', [req.session.userId])
     for (let tabla of results ){
      const [productos] = await connection.query('SELECT p.precio FROM productos p JOIN listas_productos tp ON p.id = tp.id_productos WHERE tp.id_lista =? ',[tabla.id])
      tabla.totalprecio = productos.reduce((acc,producto)=> acc + parseFloat(producto.precio), 0)
     }
      res.render('tablas', { listas : results });
    });

router.post("/crearTabla",async(req,res,next)=>{

  const { nombre } = req.body;

  await connection.query('INSERT INTO listas (id_usuario, nombre) VALUES (?, ?)', [req.session.userId, nombre])
    res.redirect('/tablas');
  });



  router.post('/carrito/add/:id', async (req, res) => {

    const productId = req.params.id;
  
    await connection.query('INSERT INTO carritos (user_id, product_id) VALUES (?, ?)', [req.session.userId, productId]);
    res.status(200).json({ message: 'Producto añadido al carrito' });
  });
  
  router.get('/cart', async (req, res) => {
    const [cart] = await connection.query(`SELECT productos.id, productos.nombre, productos.descrip, productos.precio, productos.imagen FROM carritos JOIN productos ON carritos.product_id = productos.id WHERE carritos.user_id = ?`, [req.session.userId]);
    const total = cart.reduce((acc,producto)=> acc + parseFloat(producto.precio), 0)
    res.render('cart', { cart, total});
  });

  router.post('/carrito/remove/:id', async (req, res) => {
    const productId = req.params.id;
    await connection.query('DELETE FROM carritos WHERE user_id = ? AND product_id = ?', [req.session.userId, productId]);
    res.status(200).json({ message: 'Producto eliminado del carrito' });
});








  router.get("/login",(req,res,next)=>{
    res.render("login")
})
  
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await connection.execute('SELECT * FROM usuarios WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      const user = rows[0];
      req.session.userId = user.id;
      res.json({ success: true, message: 'Login successful', redirectUrl: '/main' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }

});

router.post('/register', async (req, res) => {
  const { username, password, gmail, edad } = req.body;
  if (edad < 18) {
    return res.status(400).json({ message: 'Debes ser mayor de 18 años para registrarte', redirect: '/login' });
  } else {
    await connection.query('INSERT INTO usuarios (username, password, gmail, edad) VALUES (?, ?, ?, ?)', [username, password, gmail, edad]);
    return res.status(200).json({ message: 'Usuario registrado con éxito', redirect: '/' });
  }
});

module.exports = router;
