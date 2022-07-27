const uuid = require('uuid').v4;
const MessageDTO = require('../../../models/dtos/message.dto')
const { consoleLogger } = require('../../../utils/logger/index')


class MessagesMongoDAO {

  static #dbinstances = {}

  constructor(database, connection) {
    if (!MessagesMongoDAO.#dbinstances[database]) {
      const db = connection.db(database);
      this._collection = db.collection('messages');
      consoleLogger.info(`Connected to ${database}: Messages!`);
      MessagesMongoDAO.#dbinstances[database] = this;
    } else {
      return MessagesMongoDAO.#dbinstances;
    }
  }

  async getAllMessages() {
    try {
      return await this._collection.find().toArray();
    } catch (error) {
      throw error
    }
  }

  async getMessageById(id) {
    try {
      return await this._collection.findOne({ _id: id });
    }
    catch (error) {
      throw error
    }
  }

  async createMessage(message) {
    try {
      const newMessage = new MessageDTO(message, uuid());
      await this._collection.insertOne(newMessage);
      return newMessage;
    }
    catch (err) {
      throw error
    }
  }

  async updateById(id, messagePayload) {
    try {
      const document = await this._collection.updateOne({ _id: id }, { $set: { ...messagePayload } });
      if (!document) {
        const errorMessage = `Wrong data message`;
        throw new Error(errorMessage);
      } else return document;
    } catch (error) {
      throw error
    }
  }
  async deleteById(id) {
    try {
      const document = await this._collection.deleteOne({ _id: id });
      if (!document) {
        const errorMessage = `Wrong data message`;
        throw new Error(errorMessage);
      } else return document;
    } catch (error) {
      throw error
    }
  }
}
module.exports = MessagesMongoDAO;