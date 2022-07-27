const express = require('express')
const MessageController= require('../../controllers/message.controller')
const router = express.Router()

const messageController = new MessageController()

router.use(express.json())
router.use(express.urlencoded({extended:true}))

router.get('/', async (req, res, next)=>{
  res.json( await messageController.getAllMessages(req, res, next))
})

router.post('/',async (req, res)=>{
  //res.json( await messageController.createMessage())
})

module.exports = router