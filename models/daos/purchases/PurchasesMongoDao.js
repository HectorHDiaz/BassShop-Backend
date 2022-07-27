const uuid = require('uuid').v4;
const PurchaseDTO = require('../../dtos/purchase.dto')
const { consoleLogger } = require('../../../utils/logger/index')

class PurchasesMongoDAO {

  static #dbinstances = {}

  constructor(database, connection) {
    if (!PurchasesMongoDAO.#dbinstances[database]) {
      const db = connection.db(database);
      this._collection = db.collection('purchases');
      consoleLogger.info(`Connected to ${database}: Purchases!`);
      PurchasesMongoDAO.#dbinstances[database] = this;
    } else {
      return PurchasesMongoDAO.#dbinstances
    }
  }

  async getAllPurchases() {
    try {
      return await this._collection.find().toArray();
    } catch (error) {
      throw error
    }
  }

  async getPurchaseById(id) {
    try {
      return await this._collection.findOne({ _id: id });
    }
    catch (error) {
      throw error
    }
  }

  async createPurchase(purchase) {
    try {
      const newPurchase = new PurchaseDTO(purchase, uuid());
      await this._collection.insertOne(newPurchase);
      return newPurchase;
    }
    catch (error) {
      throw error
    }
  }

  async updateById(id, purchasePayload) {
    try {
      const document = await this._collection.updateOne({ _id: id }, { $set: { ...purchasePayload } });
      if (!document) {
        const errorPurchase = `Wrong data purchase`;
        throw new Error(errorPurchase);
      } else return document;
    } catch (error) {
      throw error
    }
  }
  async deleteById(id) {
    try {
      const document = await this._collection.deleteOne({ _id: id });
      if (!document) {
        const errorPurchase = `Wrong data purchase`;
        throw new Error(errorPurchase);
      } else return document;
    } catch (error) {
      throw error
    }
  }
}
module.exports = PurchasesMongoDAO;