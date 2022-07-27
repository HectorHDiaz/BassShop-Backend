class MessageDTO {
    constructor(messageItem, _id) {
      Object.assign(this, messageItem);
      this.createdAt = messageItem.createdAt || Date.now();
      if (_id) {
        this._id = _id;
      }
    }
  };
  
  module.exports = MessageDTO;