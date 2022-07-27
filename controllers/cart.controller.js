const CartServices = require('../services/cart.services');

class CartController {
  constructor() {
    this.cartServices = new CartServices()
  }

  getAllCarts = async (req, res, next) => {
    try {
      const allCarts = await this.cartServices.getAllCartsService()
      res.json(allCarts);
    } catch (error) {
      next(error)
    }
  }

  getCartById = async (cartId, next) => {
    try {
      const theCart = await this.cartServices.getCartByIdService(cartId)
      return theCart;
    } catch (error) {
      next(error)
    }
  }

  postNewCart = async (userId, next) => {
    try {
      const newCartId = await this.cartServices.createCartService(userId)
      return newCartId;
    } catch (error) {
      next(error)
    }
  }

  getCartProducts = async (req, res, next) => {
    try {
      const cartId = req.params.cartId
      const products = await this.cartServices.getCartProductsService(cartId);
      return res.json(products)
    } catch (error) {
      next(error)
    }
  }

  postNewProduct = async (req, res, next) => {
    try {
      const cartId = req.params.cartId;
      const productId = req.params.productId;
      await this.cartServices.addProductToCartService(cartId, productId)
      return res.json({ response: `Se agregó el producto al carro.` });
    } catch (error) {
      next(error)
    }
  }

  deleteProductCart = async (req, res, next) => {
    try {
      const cartId = req.params.cartId;
      const productId = req.params.productId;
      await this.cartServices.removeProductToCartService(cartId, productId);
      return res.json({ response: 'Se eliminó el producto al carro.' })
    } catch (error) {
      next(error)
    }
  }

  purchaseCart = async (req, res, next) => {
    try {
      const cartId = req.params.cartId;
      await this.cartServices.purchaseCartService(cartId)
      return res.json({ response: 'Pedido realizado. Compra en Proceso' })
    } catch (error) {
      next(error)
    }
  }

  deleteCart = async (req, res, next) => {
    try {
      const cartId = req.params.cartId;
      await this.cartServices.deleteCartService(cartId)
      return res.json({ response: 'Cart eliminado' })
    } catch (error) {
      next(error)
    }
  }

  deleteAllProducts = async (req, res, next) => {
    try {
      const cartId = req.params.cartId;
      await this.cartServices.deleteCartProducts(cartId)
      return res.json('Carrito vaciado!')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CartController