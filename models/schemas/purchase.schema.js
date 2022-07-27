const yup = require('yup');

class PurchaseSchema {

  static #Schema = yup.object({
    client: yup.string(),
    items: yup.array(),
    orderNumber: yup.number(),
    state: yup.string(),
    address: yup.string(),
    total: yup.number()
  });

  constructor(client, items, orderNumber, state, address) {
    this.client = client;
    this.items = items;
    this.orderNumber = orderNumber;
    this.state = state;
    this.address = address
  }

  static async validate(purchaseItem) {
    try {
      return await PurchaseSchema.#Schema.validate(purchaseItem);
    }
    catch (error) {
      throw error;
    }
  }
}

module.exports = PurchaseSchema
