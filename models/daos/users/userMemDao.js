const path = require('path')
const fs = require('fs')
const uuid = require('uuid').v4;
const UsersDTO = require('../../dtos/user.dto')
const dataPath = path.resolve(__dirname, "./usersData.txt")


class UsersMemDAO {
  constructor() {
    this.users = this.readFileDAO()
    this.saveUsersFile = () => {
      fs.writeFileSync(dataPath, JSON.stringify(this.users, null, 3))
    }
  }
  readFileDAO() {
    try {
      this.users = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    } catch (error) {
      throw new Error('While reading file.')
    }
  }
  getAllUsers() {
    try {
      this.readFileDAO()
      return this.users;
    } catch (error) {
      throw error
    }
  };

  getUserById(id) {
    try {
      this.readFileDAO()
      const user = this.users.find((user) => user._id === id);
      return user || { error: `el usero ${id} no fué encontrado!` };
    } catch (error) {
      throw error
    }
  };

  getUserByEmail(email) {
    try {
      this.readFileDAO()
      const user = this.users.find((user) => user.email === email);
      return user || { error: `el usero ${email} no fué encontrado!` };
    } catch (error) {
      throw error
    }
  };

  postNewUser(userPayload) {
    try {
      this.readFileDAO()
      const newId = uuid()
      const newUser = new UsersDTO(userPayload, newId)
      this.users.push(newUser)
      this.saveUsersFile()
      return newUser;
    } catch (error) {
      throw error
    }
  };

  updateUserById(id, userPayload) {
    try {
      this.readFileDAO()
      const index = this.users.findIndex((user) => user._id === id);
      if (index < 0) return { error: `No se encontró un user con el id: ${id}!` };
      const updateduser = {
        ...this.users[index],
        ...userPayload
      }
      const replaceduser = new UsersDTO(updateduser)
      this.users[index] = replaceduser
      this.saveUsersFile()
      return replaceduser;
    } catch (error) {
      throw error
    }
  };

  deleteUserById(id) {
    try {
      this.readFileDAO()
      const index = this.users.findIndex(user => user._id === id);
      if (index < 0) return { error: `No se encontró un usero con el id: ${id}!` };
      const newList = this.users.splice(index, 1);
      this.saveUsersFile()
      return newList
    } catch (error) {
      throw error
    }
  };
}

module.exports = UsersMemDAO;