const express = require('express')
const os = require('os');
const config = require('../config/config')
const productsRouter = require('./products/products.router')
const cartsRouter = require('./carts/cart.router')
const usersRouter = require('./users/user.router')
const authRouter = require('./auth/authRoute')
const fileRouter = require('./file/fileRoute')
const messagesRouter = require('./message/message.routes')
const purchasesRouter = require('./purchases/purchase.routes')
const CartController = require('../controllers/cart.controller')
const ProductsController = require('../controllers/products.controller')

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))
router.use('/products', productsRouter)
router.use('/carts', cartsRouter)
router.use('/auth', authRouter)
router.use('/file', fileRouter)
router.use('/users', usersRouter)
router.use('/messages', messagesRouter)
router.use('/purchases', purchasesRouter)

const cartController = new CartController()
const productsController = new ProductsController()

router.get('/', async (req, res, next) => {
  const sessionName = req.user;
  const allProducts = await productsController.getAllProducts(req, res, next)
  try {
    if (sessionName) {
      const sessionCart = await cartController.getCartById(sessionName.cart, next)
      return res.render('index', { sessionName, sessionCart, allProducts })
    }
    res.render('index', { sessionName, allProducts })
  }
  catch (error) {
    next(error)
  }
})

router.get('/desloguear', (req, res, next) => {
  try {
    const deslogueoName = req.user
    req.logout(
      ()=>{
        res.render('index', { deslogueoName })
      }
    );
  } catch (error) {
    next(error)
  }
});

router.get('/login', (req, res, next) => {
  try {
    res.render('login.html')
  } catch (error) {
    next(error)
  }
})

router.get('/register-error', (req, res, next) => {
  try {
    res.render('index', { titleError: "register-error", message: "USER ERROR SIGNUP" });
  } catch (error) {
    next(error)
  }
});

router.get('/login-error', (req, res, next) => {
  try {
    res.render('index', { titleError: "login-error", message: "USER ERROR LOGIN" });
  } catch (error) {
    next(error)
  }
});

router.get('/exconfig', (req, res, next) => {
  try {
    let sessionTime
    let sessionUser
    try {
      sessionTime = req.session.cookie.expires.toUTCString()
      sessionUser = req.session.passport.user
      res.render('index', { config, sessionTime, sessionUser })
    } catch (error) {
      sessionTime = 'No hay usuario en sesión'
      sessionUser = 'No hay usuario en sesión'
      res.render('index', { config, sessionTime, sessionUser })
    }
  } catch (error) {
    next(error)
  }
})

router.get('/config', (req, res, next) => {
  try {
    const info = {
      cpuNumber: os.cpus().length,
      platformName: process.platform,
      versionNode: process.version,
      rss: process.memoryUsage().rss,
      path: process.argv[0],
      processId: process.pid,
      projectFolder: `${process.cwd()}`
    }
    res.render('serverconfig.pug', { info })
  } catch (error) {
    next(error)
  }
})

router.get('*', (req, res, next) => {
  try {
    const error = '404! La página solicitada no existe!'
    res.status(404).render('errorpage.ejs', {error})
  } catch (error) {
    next(error)
  }
});



module.exports = router