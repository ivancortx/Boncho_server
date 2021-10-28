const express = require('express')
const {
  saveUser,
  fetchCategories,
  addNewAuction,
  loadAuctions,
  fetchProduct,
  fetchCurrentPrice,
  modificatedCurrentPrice,
  addProfile,
  fetchProfile,
  fetchProductsByCategory,
  updateUserCash,
  fetchUserCash
} = require('../controllers/placeController')

const router = express.Router()

router.post('/save-user', saveUser)
router.get('/fetch-categories', fetchCategories)
router.post('/add-auction', addNewAuction)
router.get('/fetch-auctions', loadAuctions)
router.get('/fetch-product/:auctionId', fetchProduct)
router.get('/fetch-currentPrice/:auctionId', fetchCurrentPrice)
router.get('/modificated-currentPrice/:auctionId&:stepPrice&:seePrice', modificatedCurrentPrice)
router.post('/add-profile', addProfile)
router.get('/fetch-profile/:email', fetchProfile)
router.get('/fetch-products-by-category/:category', fetchProductsByCategory)
router.post('/update-user-cash', updateUserCash)
router.post('/fetch-user-cash', fetchUserCash)

module.exports = {
  routes: router
}