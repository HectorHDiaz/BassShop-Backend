class ProductDTO {
    constructor(productItem, _id) {
      Object.assign(this, productItem);
      this.createdAt = productItem.createdAt || Date.now();
      this.updatedAt = Date.now();
      if (_id) {
        this._id = _id;
      }
    }
  };
  
  module.exports = ProductDTO;