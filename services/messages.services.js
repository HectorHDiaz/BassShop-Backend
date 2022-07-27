const config = require('../config/config');
const DAOSFactory = require('../models/daos/daos.factory');
const MessageSchema = require('../models/schemas/message.schema');


class MessageServices {
  static async #validateMessage(message) {
    try {
      return await MessageSchema.validate(message);
    }
    catch (error) {
      throw new Error('Service Validation Error')
    }
  }
  constructor() {
    DAOSFactory.getDAOS(config.DATA_SOURCE).then((daos) => {
      if (config.DATA_SOURCE.toLowerCase() === 'mongo') {
        this.messageDAO = daos.messageDao[config.DATABASE]
      } else {
        this.messageDAO = daos.messageDao
      }
    })
  }

  async getAllMessagesService() {
    try {
      return await this.messageDAO.getAllMessages()
    } catch (error) {
      throw new Error(`Getting all Messages. ${error}`)
    }
  }

  async getMessageByIdService(id) {
    try {
      if (!id) {
        throw new Error(`Message does not exist`)
      }
      return await this.messageDAO.getMessageById(id)
    } catch (error) {
      throw new Error(`Getting the message. ${error}`)
    }
  }

  async createMessageService(messagePayload) {
    try {
      const newMessage = await MessageServices.#validateMessage(messagePayload);
      return await this.messageDAO.createMessage(newMessage);
    } catch (error) {
      throw new Error(`Creating message. ${error}`)
    }
  }
}

module.exports = MessageServices