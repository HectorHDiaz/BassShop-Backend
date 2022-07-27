const config = require('../../config/config');
const MongoDBClient = require('../../db/clients/mongo/mongo.client');
const CartMemDAO = require('./cart/CartMemDao'),
  ProductMemDAO = require('./products/ProductsMemDao'),
  UserMemDAO = require('./users/userMemDao'),
  MessagesMemDAO = require('./messages/MessagesMemDao'),
  PurchasesMemDAO = require('./purchases/PurchasesMemDao');
const CartMongoDAO = require('./cart/CartMongoDao'),
  ProductMongoDAO = require('./products/ProductsMongoDao'),
  UserMongoDAO = require('./users/userMongoDao'),
  MessagesMongoDAO = require('./messages/MessagesMongoDao'),
  PurchasesMongoDAO = require('./purchases/PurchasesMongoDao');

class DAOSFactory {
  static async getDAOS(type) {
    let productsDao,
      cartsDao,
      userDao,
      messageDao,
      purchaseDao;

    switch (type.toLowerCase()) {
      case 'mem':
        cartsDao = new CartMemDAO();
        productsDao = new ProductMemDAO();
        messageDao = new MessagesMemDAO();
        purchaseDao = new PurchasesMemDAO();
        userDao = new UserMemDAO();
        break;
      case 'mongo':
        cartsDao = new CartMongoDAO(config.DATABASE, await MongoDBClient.getConnection());
        productsDao = new ProductMongoDAO(config.DATABASE, await MongoDBClient.getConnection());
        messageDao = new MessagesMongoDAO(config.DATABASE, await MongoDBClient.getConnection());
        purchaseDao = new PurchasesMongoDAO(config.DATABASE, await MongoDBClient.getConnection());
        userDao = new UserMongoDAO(config.DATABASE, await MongoDBClient.getConnection());
        break;
      default:
        throw new Error('Solo está configurado el modo: Mongo(PRD) y Mem(DEV).');
    }
    return {
      cartsDao,
      productsDao,
      userDao,
      messageDao,
      purchaseDao
    }
  }
}

module.exports = DAOSFactory