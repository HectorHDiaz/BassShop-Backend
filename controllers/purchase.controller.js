const PurchaseService = require('../services/purchases.services')

class PurchaseController {
  constructor() {
    this.purchaseService = new PurchaseService()
  }

  getAllPurchases = async (req, res, next) => {
    try {
      const allPurchases = await this.purchaseService.getAllPurchasesService()
      return allPurchases;
    } catch (error) {
      next(error)
    }
  }
  getPurchaseById = async (req, res, next) => {
    try {
      const purchaseId = req.params.purchaseId;
      const searchedPurchase = await this.purchaseService.getPurchaseByIdService(purchaseId);
      return searchedPurchase;
    } catch (error) {
      next(error)
    }
  }
  createPurchase = async (purchasePayload, next) => {
    try {
      const newPurchase = await this.purchaseService.createPurchaseService(purchasePayload);
      return newPurchase;
    } catch (error) {
      next(error)
    }
  }
}
module.exports = PurchaseController