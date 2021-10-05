'use strict'
const admin = require('../config/firebase-config')
const firestore = admin.firestore()

const saveUser = async (req, res) => {
  try {
    const adminsQueryDocument = await firestore.collection("admins").doc('admins').get()
    const admins = await adminsQueryDocument.data().admin
    const token = await req.cookies.token
    const decodeValue = await admin.auth().verifyIdToken(token)
    const userId = decodeValue.uid

    const newAdmin = admins.filter(item => item.email === decodeValue.email)
    if (newAdmin[0]) {
      if (newAdmin[0].email === decodeValue.email) {
        decodeValue["roles"] = ["user", "admin"]
      }
    } else decodeValue["roles"] = ["user"]
    await firestore.collection("usersData").doc(userId).set(decodeValue)
    return res.json(decodeValue)
  } catch (e) {
    return res.json({message: 'Internal Error'})
  }
}


const fetchCategories = async (req, res) => {
  try {
    const catalog = await firestore.collection("productsCategory").doc('categories')
    const data = await catalog.get()

    if (!data.exists) {
      res.status(404).send('Categories not found')
    } else {
      res.send(data.data())
    }

  } catch (error) {
    res.status(400).send(error.message)
  }
}

const addNewAuction = async (req, res) => {
  try {
    const fetchAuctions = await firestore.collection("auctionsData").doc('auctions')
    const auctionsData = await fetchAuctions.get()
    const auctions = auctionsData.data()
    const data = req.body.data
    auctions['auctions'].push(data)
    await firestore.collection('auctionsData').doc('auctions').set(auctions)
    res.send('Auction saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const loadAuctions = async (req, res) => {
  try {
    const catalog = await firestore.collection("auctionsData").doc('auctions')
    const data = await catalog.get()

    if (!data.exists) {
      res.status(404).send('Auctions not found')
    } else {
      res.send(data.data())
    }

  } catch (error) {
    res.status(400).send(error.message)
  }
}


module.exports = {
  saveUser,
  fetchCategories,
  addNewAuction,
  loadAuctions
}




// const updatePhotos = async (req, res) => {
//   try {
//     const data = req.body.data;
//     const title = req.body.title
//     await firestore.collection('photosData').doc(title).set(data)
//     res.send('Photos saved successfuly')
//   } catch (error) {
//     res.status(400).send(error.message)
//   }
// }
//
// const fetchPhoto = async (req, res) => {
//   try {
//     const title = req.params.title
//     const catalog = await firestore.collection("photosData").doc(title)
//     const data = await catalog.get()
//
//     if (!data.exists) {
//       res.status(404).send('Photo not found')
//     } else {
//       res.send(data.data())
//     }
//
//   } catch (error) {
//     res.status(400).send(error.message)
//   }
// }
//
// const updateVideos = async (req, res) => {
//   try {
//     const data = req.body.data
//     const title = req.body.title
//     await firestore.collection('videosData').doc(title).set(data)
//     res.send('Videos saved successfuly')
//   } catch (error) {
//     res.status(400).send(error.message)
//   }
// }
//
// const fetchVideo = async (req, res) => {
//   try {
//     const title = req.params.title
//     const catalog = await firestore.collection("videosData").doc(title)
//     const data = await catalog.get()
//
//     if (!data.exists) {
//       res.status(404).send('Video not found')
//     } else {
//       res.send(data.data())
//     }
//
//   } catch (error) {
//     res.status(400).send(error.message)
//   }
// }



// const fetchReviews = async (req, res) => {
//   try {
//     const collection = await firestore.collection("reviewsData").doc('reviews')
//     const data = await collection.get()
//
//     if (!data.exists) {
//       res.status(404).send('Reviews not found')
//     } else {
//       res.send(data.data())
//     }
//
//   } catch (error) {
//     res.status(400).send(error.message)
//   }
// }
//
// const updateReviews = async (req, res) => {
//   try {
//     const data = req.body.data
//     await firestore.collection('reviewsData').doc('reviews').set(data)
//     res.send('Reviews saved successfuly')
//   } catch (error) {
//     res.status(400).send(error.message)
//   }
// }
