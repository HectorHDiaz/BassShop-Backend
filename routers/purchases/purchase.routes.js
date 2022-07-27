const express = require('express')
const PurchaseController = require('../../controllers/purchase.controller')
const router = express.Router()

const purchaseController = new PurchaseController()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('/', purchaseController.getAllPurchases)

module.exports = router