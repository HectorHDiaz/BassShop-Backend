const path = require('path')
const fs = require('fs')
const uuid = require('uuid').v4;
const PurchaseDTO = require('../../dtos/purchase.dto')
const dataPath = path.resolve(__dirname, "./purchasesData.txt")

class PurchasesMemDAO {
  constructor() {
    this.purchases = this.readFileDAO()
    this.savePurchasesFile = () => {
      fs.writeFileSync(dataPath, JSON.stringify(this.purchases, null, 3))
    }
  }
  readFileDAO() {
    try {
      this.purchases = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    } catch (error) {
      throw new Error('While reading file.')
    }
  }
  getAllPurchases() {
    try {
      this.readFileDAO()
      return this.purchases;
    } catch (error) {
      throw error
    }
  };

  getPurchaseById(id) {
    try {
      this.readFileDAO()
      const purchase = this.purchases.find((purchase) => purchase._id === id);
      return purchase || { error: `La orden de compra ${id} no fué encontrada!` };
    } catch (error) {
      throw error
    }
  };

  async createPurchase(purchasePayload) {
    try {
      this.readFileDAO()
      const newPurchase = new PurchaseDTO(purchasePayload, uuid())
      this.purchases.push(newPurchase)
      this.savePurchasesFile()
      return newPurchase;
    } catch (error) {
      throw error
    }
  };

  updateById(id, purchasePayload) {
    try {
      this.readFileDAO()
      const index = this.purchases.findIndex(purchase => purchase._id === id);
      if (index < 0) return { error: `No se encontró un mensaje con el id: ${id}!` };
      const updatedPurchase = {
        ...this.purchases[index],
        ...purchasePayload
      }
      const replacedPurchase = new PurchaseDTO(updatedPurchase)
      this.purchases[index] = replacedPurchase
      this.savePurchasesFile()
      return replacedPurchase;
    } catch (error) {
      throw error
    }
  };
  deleteById(id) {
    try {
      this.readFileDAO()
      const index = this.purchases.findIndex(purchase => purchase._id === id);
      if (index < 0) return { error: `No se encontró un purchase con el id: ${id}!` };
      const newList = this.purchases.splice(index, 1);
      this.savePurchasesFile()
      return newList
    } catch (error) {
      throw error
    }
  };
}

module.exports = PurchasesMemDAO;