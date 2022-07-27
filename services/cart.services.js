const config = require('../config/config');
const DAOSFactory = require('../models/daos/daos.factory');
const CartSchema = require('../models/schemas/cart.schema');
const PurchaseServices = require('../services/purchases.services');

const purchaseServices = new PurchaseServices()

class CartServices {
  static async #validateCart(cart) {
    try {
      return await CartSchema.validate(cart);
    } catch (error) {
      throw new Error('Service Validation Error')
    }
  }
  constructor() {
    DAOSFactory.getDAOS(config.DATA_SOURCE).then((daos) => {
      if (config.DATA_SOURCE.toLowerCase() === 'mongo') {
        this.cartDAO = daos.cartsDao[config.DATABASE];
        this.prodDAO = daos.productsDao[config.DATABASE];
        this.userDAO = daos.userDao[config.DATABASE];
      } else {
        this.cartDAO = daos.cartsDao;
      }
    })
  }

  async getAllCartsService() {
    try {
      const allCarts = await this.cartDAO.getAllCarts()
      return allCarts;
    } catch (error) {
      throw new Error(`Getting all Carts. ${error}`)
    }
  }
  async getCartByIdService(id) {
    try {
      const theCart = await this.cartDAO.getCartById(id)
      return theCart
    } catch (error) {
      throw new Error('Error fetching the product', error)
    }
  }
  async createCartService(userId) {
    try {
      const newCart = {
        owner: userId,
        timestamp: Date.now(),
        products: [],
      }
      const validateCart = await CartServices.#validateCart(newCart)
      const newMongoCart = await this.cartDAO.createCart(validateCart)
      return newMongoCart._id
    } catch (error) {
      throw new Error('Error creating the cart', error)
    }
  }
  async updateCartService(id, cart) {
    try {
      const updatedCart = this.cartDAO.updateCartById(id, cart)
      return updatedCart;
    } catch (error) {
      throw new Error('Error updating the cart', error)
    }
  }

  async getCartProductsService(id) {
    try {
      const theCart = await this.cartDAO.getCartById(id);
      return theCart.products
    } catch (error) {
      throw new Error(`Error getting the cart: ${error}`)
    }
  }
  async addProductToCartService(cartId, productId) {
    try {
      const theCart = await this.cartDAO.getCartById(cartId);
      const theProduct = await this.prodDAO.getProductById(productId)
      const productAlready = theCart.products.find(product => product._id === productId);

      if (productAlready) {
        const index = theCart.products.findIndex(product => product._id === productId);
        theCart.products[index].quantity += 1;
      } else {
        theCart.products.push(theProduct)
        const index = theCart.products.findIndex(product => product._id === productId);
        theCart.products[index].quantity = 1;
      }

      const updatedCart = await this.cartDAO.updateCartById(cartId, theCart);
      return updatedCart;
    } catch (error) {
      throw new Error('Error updating the cart', error)
    }
  }
  async removeProductToCartService(cartId, productId) {
    try {
      const theCart = await this.cartDAO.getCartById(cartId);
      const index = theCart.products.findIndex(product => product._id === productId);
      const productAlready = theCart.products[index].quantity;

      if (productAlready > 1) {
        theCart.products[index].quantity -= 1
      } else {
        theCart.products.splice(index, 1)
      }

      const updatedCart = await this.cartDAO.updateCartById(cartId, theCart);
      return updatedCart;
    } catch (error) {
      throw new Error('Error removing product', error)
    }
  }
  async purchaseCartService(cartId) {
    try {
      const theCart = await this.cartDAO.getCartById(cartId);
      const theOwner = await this.userDAO.getUserById(theCart.owner);

      await purchaseServices.createPurchaseService(theOwner, theCart)

      const newCart = { ...theCart._doc, products: [] }
      await this.cartDAO.updateCartById(cartId, newCart);
      return true
    } catch (error) {
      throw new Error('Error purchasing the cart', error)
    }
  }

  async deleteCartProducts(cartId) {
    try {
      const theCart = await this.cartDAO.getCartById(cartId);
      theCart.products = [];
      await this.cartDAO.updateCartById(cartId, theCart);
    } catch (error) {
      throw new Error('Error deleting product from cart', error)
    }
  }
  async deleteCartService(cartId) {
    await this.cartDAO.deleteCartById(cartId);
  }
}
module.exports = CartServices;