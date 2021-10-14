const admin = require('../config/firebase-config')

const fetchCurrentPriceCheckRole = async(req, res, next) => {
  const token = await req.cookies.token

  admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        const uid = decodedToken.uid
        if (uid) next()

      })
      .catch((error) => {
        // Handle error
      });
}

module.exports = fetchCurrentPriceCheckRole





