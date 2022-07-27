const express = require('express')

const ProductsController= require('../../controllers/products.controller')

const router = express.Router()
const productsController = new ProductsController()

router.use(express.json())
router.use(express.urlencoded({extended:true}))


router.get('/', async (req, res, next)=>{
    res.json( await productsController.getAllProducts(req, res, next))
})

router.get('/:productId',productsController.getProductById)

router.get('/category/:category', async (req, res, next)=>{
    res.json( await productsController.getProductsByCategory(req, res, next))
})

router.post('/',async (req, res, next)=>{
    res.json( await productsController.saveNewProduct(req, res, next))
})

router.put('/:productId', async (req, res, next)=>{
    res.json( await productsController.updateProduct(req, res, next))
})

router.delete('/:productId', async (req, res, next)=>{
    res.json( await productsController.deleteProduct(req, res, next))
})

module.exports = router;