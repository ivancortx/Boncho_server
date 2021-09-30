const express = require('express')
const {
  // updatePhotos,
  // fetchPhoto,
  saveUser,
  sessionLogin,
  // updateVideos,
  // fetchVideo,
  // fetchReviews,
  // updateReviews
} = require('../controllers/placeController')

const router = express.Router()

// router.post('/add-photo', updatePhotos)
// router.get('/fetch-photo/:title', fetchPhoto)
// router.post('/add-video', updateVideos)
// router.get('/fetch-video/:title', fetchVideo)
router.post('/save-user', saveUser)
router.post('/sessionLogin', sessionLogin)
// router.get('/fetch-reviews', fetchReviews)
// router.post('/add-review', updateReviews)

module.exports = {
  routes: router
}