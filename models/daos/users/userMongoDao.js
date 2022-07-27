const uuid = require('uuid').v4;
const UserDTO = require('../../../models/dtos/user.dto')
const { consoleLogger } = require('../../../utils/logger/index');

class UserMongoDAO {
  static #dbInstance = {};

  constructor(database, connection) {
    if (!UserMongoDAO.#dbInstance[database]) {
      const db = connection.db(database);
      this._collection = db.collection('users');
      consoleLogger.info(`Connected to ${database}: Users!`);
      UserMongoDAO.#dbInstance[database] = this;
    } else {
      return UserMongoDAO.#dbInstance;
    }
  }
  async getAllUsers() {
    try {
      return await this._collection.find().toArray()
    } catch (error) {
      throw error
    }
  }
  async getUserByEmail(email) {
    try {
      const document = await this._collection.findOne({ email }, { __v: 0 });
      if (!document) {
        const errorMessage = `Wrong username or password`;
        throw new Error(errorMessage);
      } else return document;

    } catch (error) {
      throw error
    }
  }
  async getUserById(id) {
    try {
      const document = await this._collection.findOne({ _id: id }, { __v: 0 });
      if (!document) {
        const errorMessage = `Cannot find user by id`;
        throw new Error(errorMessage);
      } else return document;

    } catch (error) {
      throw error
    }
  }

  async postNewUser(userItem) {
    try {
      const newUser = new UserDTO(userItem, uuid());
      await this._collection.insertOne(newUser);
      return newUser;
    }
    catch (error) {
      throw error
    }
  };

  async updateUserById(id, userInfo) {
    try {
      const document = await this._collection.updateOne({ _id: id }, { $set: { ...userInfo } });
      if (!document.acknowledged) {
        const errorMessage = `Wrong username or password`;
        throw new Error(errorMessage);
      } else return userInfo;
    } catch (error) {
      throw error
    }
  }
  async connect() {
    console.log('Una conexión')
  }
  async deleteUserById(id) {
    try {
      const document = await this._collection.deleteOne({ _id: id });
      if (!document) {
        const errorMessage = `Wrong data user`;
        throw new Error(errorMessage);
      } else return document;
    } catch (error) {
      throw error
    }
  }
}

module.exports = UserMongoDAO;