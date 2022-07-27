const uuid = require('uuid').v4;
const ProductDTO = require('../../../models/dtos/product.dto')
const { consoleLogger } = require('../../../utils/logger/index')

class ProductsMongoDAO {

  static #dbinstances = {}

  constructor(database, connection) {
    if (!ProductsMongoDAO.#dbinstances[database]) {
      const db = connection.db(database);
      this._collection = db.collection('products');
      consoleLogger.info(`Connected to ${database}: Products!`);
      ProductsMongoDAO.#dbinstances[database] = this;
    } else {
      return ProductsMongoDAO.#dbinstances
    }
  }
  async getAllProducts() {
    try {
      return await this._collection.find().toArray();
    } catch (error) {
      throw error
    }
  }

  async getProductById(id) {
    try {
      const theProduct = await this._collection.findOne({ _id: id });
      if(!theProduct){
        throw new Error(`Product ${id} does not exist`)
      }
      return theProduct;
    }
    catch (error) {
      throw error
    }
  }
  async createProduct(resourceItem) {
    try {
      const newProduct = new ProductDTO(resourceItem, uuid());
      await this._collection.insertOne(newProduct);
      return newProduct;
    }
    catch (err) {
      throw error
    }
  }

  async updateProductById(id, productsInfo) {
    try {
      const document = await this._collection.updateOne({ _id: id }, { $set: { ...productsInfo } });
      if (!document) {
        const errorMessage = `Wrong data product`;
        throw new Error(errorMessage);
      } else return document;
    } catch (error) {
      throw error
    }
  }

  async deleteProductById(id) {
    try {
      const document = await this._collection.deleteOne({ _id: id });
      if (!document) {
        const errorMessage = `Wrong data product`;
        throw new Error(errorMessage);
      } else return document;
    } catch (error) {
      throw error
    }
  }
}

module.exports = ProductsMongoDAO;