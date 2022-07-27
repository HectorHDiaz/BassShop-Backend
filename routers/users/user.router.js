const express = require('express')
const UserController = require('../../controllers/user.controllers')

const userController = new UserController()
const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('/', userController.getAllUsers)
router.get('/:userId', userController.getUserById)
router.post('/', userController.createUserController)
router.put('/:userId', userController.updateUser)

module.exports = router