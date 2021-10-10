const express = require('express')
const {
  saveUser,
  fetchCategories,
  addNewAuction,
  loadAuctions,
  fetchProduct
} = require('../controllers/placeController')

const router = express.Router()

router.post('/save-user', saveUser)
router.get('/fetch-categories', fetchCategories)
router.post('/add-auction', addNewAuction)
router.get('/fetch-auctions', loadAuctions)
router.get('/fetch-product/:auctionId', fetchProduct)


module.exports = {
  routes: router
}