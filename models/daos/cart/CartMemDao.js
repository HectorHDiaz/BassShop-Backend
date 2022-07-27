const path = require('path')
const fs = require('fs')
const uuid = require('uuid').v4;
const CartsDTO = require('../../dtos/cart.dto');
const dataPath = path.resolve(__dirname, "./cartsData.txt")


class CartsMemDAO {
  constructor() {
    this.carts = this.readFileDAO()
    this.saveCartsFile = () => {
      fs.writeFileSync(dataPath, JSON.stringify(this.carts, null, 3))
    }
  }
  readFileDAO() {
    try {
      this.carts = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    } catch (error) {
      throw new Error('While reading file.')
    }
  }
  getAllCarts() {
    try {
      this.readFileDAO()
      return this.carts;
    } catch (error) {
      throw error
    }
  };

  getCartById(id) {
    try {
      this.readFileDAO()
      const theCart = this.carts.find((cart) => cart._id === id);
      return theCart || { error: `La cart ${id} no fué encontrada!` };
    } catch (error) {
      throw error
    }
  };

  createCart(cartPayload) {
    try {
      this.readFileDAO()
      const newCart = new CartsDTO(cartPayload, uuid())
      this.carts.push(newCart)
      this.saveCartsFile()
      return newCart;
    } catch (error) {
      throw error
    }
  };

  updateCartById(id, cartPayload) {
    try {
      this.readFileDAO()
      const index = this.carts.findIndex(cart => cart._id === id);
      if (index < 0) return { error: `No se encontró una Cart con el id: ${id}` };
      const updatedCart = {
        ...this.carts[index],
        ...cartPayload
      }
      const replacedCart = new CartsDTO(updatedCart)
      this.carts[index] = replacedCart
      this.saveCartsFile()
      return replacedCart;
    } catch (error) {
      throw error
    }
  };
  deleteCartById(id) {
    try {
      this.readFileDAO()
      const index = this.carts.findIndex(cart => cart._id === id);
      if (index < 0) throw new Error(`No se encontró una Cart con el id: ${id}`);
      const newList = this.carts.splice(index, 1);
      this.saveCartsFile()
      return newList
    } catch (error) {
      throw error
    }
  };
}

module.exports = CartsMemDAO;