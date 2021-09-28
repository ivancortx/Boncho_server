const admin = require('../config/firebase-config')
const firestore = admin.firestore()

const updateContentCheckRole = async(req, res, next) => {
  const adminsQueryDocument = await firestore.collection("admins").doc('admins').get()
  const admins = await adminsQueryDocument.data().admin
  const token = await req.headers.token

  admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        const uid = decodedToken.uid

        admins.filter(item => {
          if (item.uid === uid) {
            next()
          }
        })
      })
      .catch((error) => {
        // Handle error
      });
}

module.exports = updateContentCheckRole





