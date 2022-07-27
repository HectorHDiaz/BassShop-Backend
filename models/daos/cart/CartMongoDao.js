const uuid = require('uuid').v4;
const CartDTO = require('../../../models/dtos/user.dto')
const { consoleLogger } = require('../../../utils/logger/index')

class CartMongoDAO {
  static #dbInstance = {};

  constructor(database, connection) {
    if (!CartMongoDAO.#dbInstance[database]) {
      const db = connection.db(database);
      this._collection = db.collection('carts');
      consoleLogger.info(`Connected to ${database}: Carts!`);
      CartMongoDAO.#dbInstance[database] = this;
    } else {
      return CartMongoDAO.#dbInstance;
    }
  }
  async getAllCarts() {
    try {
      return await this._collection.find().toArray();
    } catch (error) {
      throw error
    }
  }
  async getCartById(id) {
    try {
      const theCart = await this._collection.findOne({ _id: id });
      return theCart;
    } catch (error) {
      throw error
    }
  }
  async createCart(cart) {
    try {
      const newCart = new CartDTO(cart, uuid());
      await this._collection.insertOne(newCart)
      return newCart
    } catch (error) {
      throw error
    }
  }
  async updateCartById(id, cart) {
    try {
      const document = await this._collection.updateOne({ _id: id }, { $set: { ...cart } });
      if (!document) {
        const errorMessage = `Wrong username or password`;
        throw new Error(errorMessage);
      } else return document;
    } catch (error) {
      throw error
    }
  }
  async deleteCartById(id) {
    try {
      const document = await this._collection.deleteOne({ _id: id });
      if (!document) {
        const errorMessage = `Wrong data cart`;
        throw new Error(errorMessage);
      } else return document;
    } catch (error) {
      throw error
    }
  }
}

module.exports = CartMongoDAO