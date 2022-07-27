const yup = require('yup');

class CartSchema {

  static #Schema = yup.object({
    owner: yup.string().required(),
    timestamp: yup.string().required(),
    products: yup.array(yup.ref('products')).required()
  });

  constructor(owner, timastamp, products) {
    this.owner = owner,
      this.timestamp = timestamp,
      this.products = products
  }

  static async validate(cartItem) {
    try {
      return await CartSchema.#Schema.validate(cartItem);
    }
    catch (error) {
      throw error;
    }
  }
}

module.exports = CartSchema;