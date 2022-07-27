const config = require('../config/config')
const DAOSFactory = require('../models/daos/daos.factory')
const CartService = require('./cart.services')
const UserSchema = require('../models/schemas/user.schema')
const { newRegisterNodemailer } = require('../utils/nodemailer')

class UserServices {
  static async #validateUser(user) {
    try {
      return await UserSchema.validate(user)
    } catch (error) {
      throw new Error('Service Validation Error')
    }
  }

  constructor() {
    DAOSFactory.getDAOS(config.DATA_SOURCE).then((daos) => {
      if (config.DATA_SOURCE.toLowerCase() === 'mongo') {
        this.userDAO = daos.userDao[config.DATABASE]
      } else {
        this.userDAO = daos.userDao
      }
    });
    this.cartService = new CartService()
  }

  async getAllUsersService() {
    try {
      return await this.userDAO.getAllUsers()
    } catch (error) {
      throw new Error(`Getting all Users. ${error}`)
    }
  }

  async getUserByIdService(id) {
    try {
      if (!id) {
        throw new Error(`User with id: ${id} does no exist`)
      }
      return await this.userDAO.getUserById(id)
    } catch (error) {
      throw new Error(`Getting the User. ${error}`)
    }
  }

  async getUserByEmailService(email) {
    try {
      if (!email) {
        throw new Error(`User with Email: ${email} does no exist`)
      }
      const theUser = await this.userDAO.getUserByEmail(email)
      return theUser
    } catch (error) {
      throw new Error(`Getting the User. ${error}`)
    }
  }

  async createUserService(user) {
    try {
      const usrObject = {
        email: user.email,
        password: user.password,
        name: user.name,
        phone: user.phone,
        address: user.address
      };
      const newUser = await this.userDAO.postNewUser(usrObject);
      const userWithCart = { ...newUser, cart: await this.cartService.createCartService(newUser._id) }
      const validateUser = await UserServices.#validateUser(userWithCart);
      const reUser = await this.userDAO.updateUserById(userWithCart._id, userWithCart)
      await newRegisterNodemailer(reUser)
      return validateUser
    } catch (error) {
      throw new Error(`Creating the User. ${error}`)
    }
  }
  async updateUserService(id, userPayload) {
    try {
      if (!id) {
        throw new Error(`User with id: ${id} does no exist`)
      }
      return await this.userDAO.updateUserById(id, userPayload)
    } catch (error) {
      throw new Error(`Updating the User. ${error}`)
    }
  }
}

module.exports = UserServices;