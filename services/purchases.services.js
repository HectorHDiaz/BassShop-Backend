const config = require('../config/config');
const DAOSFactory = require('../models/daos/daos.factory');
const PurchaseSchema = require('../models/schemas/purchase.schema');
const { newPurchaseNodemailer } = require('../utils/nodemailer');


class PurchaseServices {
  static async #validatePurchase(purchase) {
    try {
      return await PurchaseSchema.validate(purchase);
    }
    catch (error) {
      throw new Error('Service Validation Error')
    }
  }
  constructor() {
    DAOSFactory.getDAOS(config.DATA_SOURCE).then((daos) => {
      if (config.DATA_SOURCE.toLowerCase() === 'mongo') {
        this.purchaseDAO = daos.purchaseDao[config.DATABASE]
      } else {
        this.purchaseDAO = daos.purchaseDao
      }
    });
  }

  async getAllPurchasesService() {
    try {
      return await this.purchaseDAO.getAllPurchases()
    } catch (error) {
      throw new Error(`Getting all Purchases. ${error}`)
    }
  }

  async getPurchaseByIdService(id) {
    try {
      if (!id) {
        throw new Error(`Purchase with id: ${id} does no exist`)
      }
      return await this.purchaseDAO.getPurchaseById(id)
    } catch (error) {
      throw new Error(`Getting the Purchase. ${error}`)
    }
  }

  async createPurchaseService(user, cart) {
    try {
      const purchasePayload = {
        client: user.email,
        items: cart.products,
        orderNumber: this.purchaseDAO.getAllPurchases().length,
        state: 'Generada',
        address: user.address
      }
      let total = 0;
      cart.products.forEach(product => {
        total += product.price * product.quantity;
      })
      purchasePayload.total = total;

      const validatedPurchase = await PurchaseServices.#validatePurchase(purchasePayload);
      const newPurchase = await this.purchaseDAO.createPurchase(validatedPurchase);
      await newPurchaseNodemailer(user, newPurchase);
      return true
    } catch (error) {
      throw new Error(`Creating the Purchase. ${error}`)
    }
  }
}

module.exports = PurchaseServices