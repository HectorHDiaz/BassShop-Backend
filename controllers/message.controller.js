const MessageService = require('../services/messages.services')

class MessageController {
  constructor() {
    this.messageService = new MessageService()
  }

  getAllMessages = async (req, res, next) => {
    try {
      const allMessages = await this.messageService.getAllMessagesService()
      return allMessages;
    } catch (error) {
      next(error)
    }
  }
  getMessageById = async (req, res, next) => {
    try {
      const messageId = req.params.messageId;
      const searchedMessage = await this.messageService.getMessageByIdService(messageId);
      return searchedMessage;
    } catch (error) {
      next(error)
    }
  }
  createMessage = async (messagePayload, next) => {
    try {
      const newMessage = await this.messageService.createMessageService(messagePayload);
      return newMessage;
    } catch (error) {
      next(error)
    }
  }
}
module.exports = MessageController