const yup = require('yup');

class UserSchema {

  static #Schema = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
    name: yup.string().required(),
    phone: yup.string().required(),
    address: yup.string(),
    cart: yup.string(yup.ref('carts')),
  });

  constructor(email, password, name, phone, address, cart) {
    this.email = email,
      this.password = password,
      this.name = name,
      this.phone = phone,
      this.address = address,
      this.cart = cart
  }

  static async validate(userItem) {
    try {
      return await UserSchema.#Schema.validate(userItem);
    }
    catch (error) {
      throw error;
    }
  }
}

module.exports = UserSchema;