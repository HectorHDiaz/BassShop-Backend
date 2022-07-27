class PurchaseDTO {
    constructor(purchaseItem, _id) {
      Object.assign(this, purchaseItem);
      this.createdAt = purchaseItem.createdAt || Date.now();
      if (_id) {
        this._id = _id;
      }
    }
  };
  
  module.exports = PurchaseDTO;