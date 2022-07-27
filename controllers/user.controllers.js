const UserServices = require('../services/user.services')

class UserControllers {
  constructor() {
    this.service = new UserServices()
  }
  getAllUsers = async (req, res, next) => {
    try {
      const allUsers = await this.service.getAllUsersService()
      return res.json(allUsers)
    } catch (error) {
      next(error)
    }
  };
  getUserById = async (req, res, next) => {
    try {
      const { userId } = req.params
      const searchedUser = await this.service.getUserByIdService(userId)
      return res.json(searchedUser);
    } catch (error) {
      next(error)
    }
  };
  async getUserByEmailController(email,req, res, next) {
    try {
      const theUser = await this.service.getUserByEmailService(email)
      return theUser
    }
    catch (error) {
      next(error)
    }

  }
  createUserController = async (req, res, next) => {
    try {
      const infoUser = req.body;
      const newUser = await this.service.createUserService(infoUser)
      return res.json(newUser)
    }
    catch (error) {
      next(error)
    }
  }
  updateUser = async (req, res, next) => {
    try {
      const theId = req.params.userId;
      const userPayload = req.params.body;
      const newUser = await this.service.updateUserService(theId, userPayload)
      return res.json(newUser)
    }
    catch (error) {
      next(error)
    }
  }
}

module.exports = UserControllers;