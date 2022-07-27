const MessagesControllers = require('../../controllers/message.controller');
const UserControllers = require('../../controllers/user.controllers');
const messageController = new MessagesControllers();
const userControllers = new UserControllers()


async function messageSocket(socket, sockets) {
  const connectedList = [];

  socket.on('newUserMessage', async (text, email, next) => {
    const theUser = await userControllers.getUserByEmailController(email, next)
    const verifiedUser = connectedList.find(user => user.email === email)
    if (!verifiedUser) {
      newUser(email, theUser.name)
    }
    const actualUser = connectedList.find(user => user.socketId === socket.id)
    const messagePayload = {
      author: actualUser.name,
      text: text,
      type: 'user'
    }
    await messageController.createMessage(messagePayload);
    sockets.emit('allMessages', await messageController.getAllMessages());
  })

  
  const newUser = async (email, name) => {
    const sessionUser = {
      email: email,
      name: name,
      socketId: socket.id
    };
    connectedList.push(sessionUser)
    const botWelcome = {
      author: 'chatBot',
      text: `Bienvenido al Chat: ${name}!`,
      type: 'system'
    }
    await messageController.createMessage(botWelcome)
    socket.emit('allMessages', await messageController.getAllMessages());
  }
}

module.exports = messageSocket