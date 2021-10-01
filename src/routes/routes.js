const express = require('express')
const {
  saveUser,
  fetchCategories
} = require('../controllers/placeController')

const router = express.Router()

router.post('/save-user', saveUser)
router.get('/fetch-categories', fetchCategories)

module.exports = {
  routes: router
}