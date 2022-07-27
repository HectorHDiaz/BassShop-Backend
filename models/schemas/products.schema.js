const yup = require('yup');

class ProductSchema {

  static #Schema = yup.object({
    _id: yup.string().required(),
    name: yup.string().required(),
    desc: yup.string().required(),
    price: yup.number().min(0).required(),
    image: yup.string().required(),
    stock: yup.number().min(0).required(),
    category: yup.string()
  });

  constructor(id, code, timestamp, name, price, desc, stock, category) {
    this.id = id;
    this.code = code;
    this.timestamp = timestamp;
    this.name = name;
    this.price = price;
    this.image = image;
    this.desc = desc;
    this.stock = stock;
    this.category = category;
  }

  static async validate(productItem) {
    try {
      return await ProductSchema.#Schema.validate(productItem);
    }
    catch (error) {
      throw error;
    }
  }
}

module.exports = ProductSchema