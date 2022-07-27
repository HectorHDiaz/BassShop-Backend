const express = require('express')
const CartController = require('../../controllers/cart.controller')

const cartController = new CartController()
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('/', cartController.getAllCarts)
router.post('/', cartController.postNewCart)
router.get('/cart/:cartId', (req, res, next) => {
  const cartId = req.params.cartId;
  cartController.getCartById(cartId, req, res, next )
})
router.get('/:cartId', cartController.getCartProducts)
router.post('/:cartId/products/:productId', cartController.postNewProduct)
router.delete('/:cartId/products/:productId', cartController.deleteProductCart)
router.post('/:cartId', cartController.purchaseCart)
router.delete('/:cartId', cartController.deleteAllProducts)

module.exports = router