const express = require('express')
const {
  saveUser,
  fetchCategories,
  addNewAuction,
  loadAuctions,
  fetchProduct,
  fetchCurrentPrice,
  modificatedCurrentPrice
} = require('../controllers/placeController')

const router = express.Router()

router.post('/save-user', saveUser)
router.get('/fetch-categories', fetchCategories)
router.post('/add-auction', addNewAuction)
router.get('/fetch-auctions', loadAuctions)
router.get('/fetch-product/:auctionId', fetchProduct)
router.get('/fetch-currentPrice/:auctionId', fetchCurrentPrice)
router.get('/modificated-currentPrice/:auctionId&:stepPrice', modificatedCurrentPrice)

module.exports = {
  routes: router
}