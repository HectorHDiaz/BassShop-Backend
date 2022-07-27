class CartDTO {
    constructor(cartItem, _id) {
      Object.assign(this, cartItem);
      this.createdAt = cartItem.createdAt || Date.now();
      this.updatedAt = Date.now();
      if (_id) {
        this._id = _id;
      }
    }
  };
  
  module.exports = CartDTO;