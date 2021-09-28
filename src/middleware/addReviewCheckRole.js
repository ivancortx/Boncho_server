const admin = require('../config/firebase-config')

const addReviewCheckRole = async (req, res, next) => {
  const token = req.headers.token
  admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        const uid = decodedToken.uid
        if (uid) {
          next()
        }
})
      .catch((error) => {
        // Handle error
      })
}

module.exports = addReviewCheckRole