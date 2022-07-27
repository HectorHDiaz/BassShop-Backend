const path = require('path')
const fs = require('fs')
const uuid = require('uuid').v4;
const MessageDTO = require('../../dtos/message.dto')
const dataPath = path.resolve(__dirname, "./messagesData.txt")

class MessagesMemDAO {
  constructor() {
    this.messages = this.readFileDAO()
    this.saveMessagesFile = () => {
      fs.writeFileSync(dataPath, JSON.stringify(this.messages, null, 3))
    }
  }
  readFileDAO() {
    try {
      this.messages = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    } catch (error) {
      throw new Error('While reading file.')
    }
  }
  getAllMessages() {
    try {
      this.readFileDAO()
      return this.messages;
    } catch (error) {
      throw error
    }
  };

  getMessageById(id) {
    try {
      this.readFileDAO()
      const message = this.messages.find((message) => message._id === id);
      return message || { error: `el mensaje ${id} no fué encontrado!` };
    } catch (error) {
      throw error
    }
  };

  async createMessage(messagePayload) {
    try {
      this.readFileDAO()
      const newMessage = new MessageDTO(messagePayload, uuid())
      this.messages.push(newMessage)
      this.saveMessagesFile()
      return newMessage;
    } catch (error) {
      throw error
    }
  };

  updateById(id, messagePayload) {
    try {
      this.readFileDAO()
      const index = this.messages.findIndex(message => message._id === id);
      if (index < 0) return { error: `No se encontró un mensaje con el id: ${id}!` };
      const updatedMessage = {
        ...this.messages[index],
        ...messagePayload
      }
      const replacedMessage = new MessagesDTO(updatedMessage)
      this.messages[index] = replacedMessage
      this.saveMessagesFile()
      return replacedMessage;
    } catch (error) {
      throw error
    }
  };
  deleteById(id) {
    try {
      this.readFileDAO()
      const index = this.messages.findIndex(message => message._id === id);
      if (index < 0) return { error: `No se encontró un message con el id: ${id}!` };
      const newList = this.messages.splice(index, 1);
      this.saveMessagesFile()
      return newList
    } catch (error) {
      throw error
    }
  };
}

module.exports = MessagesMemDAO;