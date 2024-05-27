const express = require('express');
const router = express.Router();
const connection = require("../database/db")


function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/error');
  }
}

//---------------MATAMOS SESION--------------------

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/main')
    }
    res.clearCookie('connect.sid')
    res.redirect('/login')
  });
});

router.get("/error",(req,res)=>{
  res.render("error")
})


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



router.get('/main', isAuthenticated, async (req, res) => {
  let category = req.query.category || 'all';
  let query = 'SELECT * FROM productos';
  let params = [];

  if (category !== 'all') {
      query += ' WHERE categoria = ?';
      params.push(category);
  }

  try {
      const [products] = await connection.query(query, params);
      res.render('main', { products });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los productos');
  }
});




//--------------RUTA PARA CREAR LISTAS-------------------

router.post("/crearTabla", isAuthenticated,async(req,res,next)=>{

  const { nombre } = req.body;

  await connection.query('INSERT INTO listas (id_usuario, nombre) VALUES (?, ?)', [req.session.userId, nombre])
    res.redirect('/tablas');
  });





//--------------RUTA PARA EDITAR LISTAS-------------------

router.get("/editar/:id", isAuthenticated,async (req,res,next)=>{
  const {id} = req.params
  const [tabla] = await connection.query('SELECT * FROM listas WHERE id=?',[id])
  const [productos] = await connection.query('SELECT p.* FROM productos p INNER JOIN listas_productos lp ON p.id = lp.id_productos WHERE lp.id_lista =?',[id])
  console.log(productos)
  res.render("edit",{tabla:tabla[0], productos})

})

router.post("/editar/:id",isAuthenticated,async(req,res,next)=>{
  const {id} = req.params
  const {nombre} = req.body
  const new_nombre ={nombre}
  const id_producto = req.body.listas
  console.log(req.params)
  await connection.query('UPDATE listas SET ? WHERE id =?',[new_nombre,id])
  await connection.query('DELETE FROM listas_productos WHERE id_productos = ?',[id_producto])
  res.redirect("/tablas")
})




//--------------RUTA PARA ELIMINAR LISTAS-------------------


router.get('/delete/:id', isAuthenticated, async (req, res) => {
  const {id} = req.params
  await connection.query('DELETE FROM listas_productos WHERE id_lista = ?',[id])
  await connection.query('DELETE FROM listas WHERE id = ?', [id])
  res.redirect("/tablas")
})




//--------------RUTA PARA AÑADIR PRODUCTIS A LISTAS-------------------

router.get("/add/:id", isAuthenticated,async(req,res)=>{
  const id_producto = req.params.id;
  const [results] = await connection.query('SELECT * FROM listas WHERE id_usuario = ?', [req.session.userId])
  res.render("add",{results,id_producto})

})

router.post("/add/:id", isAuthenticated,async(req,res,next)=>{
  const id_lista = req.params.id
  const id_producto = req.body.listas
  await connection.query('INSERT INTO listas_productos (id_lista, id_productos) VALUES (?,?)',[id_lista, id_producto])
  res.redirect("/main")

  
})




//--------------RUTA PARA MOSTRAR LAS LISTAS-------------------

router.get("/tablas", isAuthenticated,async(req,res,next)=>{
     const [results] = await connection.query('SELECT * FROM listas WHERE id_usuario = ?', [req.session.userId])
     for (let tabla of results ){
      const [productos] = await connection.query('SELECT p.precio FROM productos p JOIN listas_productos tp ON p.id = tp.id_productos WHERE tp.id_lista =? ',[tabla.id])
      tabla.totalprecio = productos.reduce((acc,producto)=> acc + parseFloat(producto.precio), 0)
     }
      res.render('tablas', { listas : results });
    });





//--------------RUTA PARA AÑADIR AL CARRITO LISTAS-------------------    

  router.post('/listas/carrito/:id',isAuthenticated, async (req, res) => {
    const listaId = req.params.id;
    const [lista] = await connection.query('SELECT * FROM listas WHERE id = ?', [listaId]);
    const nombreLista = lista[0].nombre;
    const [productos] = await connection.query('SELECT p.precio FROM productos p JOIN listas_productos tp ON p.id = tp.id_productos WHERE tp.id_lista = ?', [listaId]);
    const precioTotal = productos.reduce((acc, producto) => acc + parseFloat(producto.precio), 0);
  
    await connection.query('INSERT INTO carritos (user_id, nombre_lista, precio_total, tipo) VALUES (?, ?, ?, ?)', [req.session.userId, nombreLista, precioTotal,"lista"]);
    
    res.status(200).json({ message: 'Lista añadida al carrito' });
  });





//--------------RUTA PARA AÑADIR PRODUCTOS AL CARRITO------------------
  router.post('/carrito/add/:id', isAuthenticated, async (req, res) => {

    const productId = req.params.id;
    const [producto] = await connection.query('SELECT * FROM productos WHERE id = ?', [productId])

    await connection.query('INSERT INTO carritos (user_id, nombre_lista, precio_total, tipo) VALUES (?, ?, ?, ?)', [req.session.userId, producto[0].nombre, producto[0].precio, 'producto'])

    res.status(200).json({ message: 'Producto añadido al carrito' });
  });




  //--------------RUTA PARA MOSTRAR EL CARRITO-------------------
  router.get('/cart', isAuthenticated,async (req, res) => {
    const [cart] = await connection.query(`SELECT * FROM carritos WHERE user_id = ?`, [req.session.userId]);

    const listas = cart.filter(item => item.tipo === 'lista');
    const productos = cart.filter(item => item.tipo === 'producto');

    const totalListas = listas.reduce((acc, item) => acc + parseFloat(item.precio_total), 0).toFixed(2);
    const totalProductos = productos.reduce((acc, item) => acc + parseFloat(item.precio_total), 0).toFixed(2);

    const total = (parseFloat(totalListas) + parseFloat(totalProductos)).toFixed(2)
    res.render('cart', { cart, productos, total, listas});
  });



  //--------------RUTA PARA ELIMINAR PRODUCTOS DEL CARRITO-------------------
  router.post('/carrito/remove/:id', isAuthenticated, async (req, res) => {
    const carritoId = req.params.id;
    await connection.query('DELETE FROM carritos WHERE id = ?', [carritoId]);
    res.status(200).json({ message: 'Producto eliminado del carrito' });
});





//--------------RUTAS LOGIN Y REGISTER-------------------

  router.get("/login", (req,res,next)=>{
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
