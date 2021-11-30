'use strict'
const admin = require('../config/firebase-config')
const firestore = admin.firestore()

const saveUser = async (req, res) => {
  try {
    const adminsQueryDocument = await firestore.collection('admins').doc('admins').get()
    const admins = await adminsQueryDocument.data().admin
    const token = await req.body.token
    const decodeValue = await admin.auth().verifyIdToken(token)
    const userId = decodeValue.uid

    const newAdmin = admins.filter(item => item.email === decodeValue.email)
    if (newAdmin[0]) {
      if (newAdmin[0].email === decodeValue.email) {
        decodeValue['roles'] = ['user', 'admin']
      }
    } else decodeValue['roles'] = ['user']
    await firestore.collection('usersData').doc(userId).set(decodeValue)
    return res.json(decodeValue)
  } catch (e) {
    return res.json({ message: 'Internal Error' })
  }
}


const fetchCategories = async (req, res) => {
  try {
    const catalog = await firestore.collection('productsCategory').doc('categories')
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
    const fetchAuctions = await firestore.collection('auctionsData').doc('auctions')
    const auctionsData = await fetchAuctions.get()
    const auctions = auctionsData.data()
    const data = req.body.data
    const productCurrentPrice = { currentPrice: data.startPrice }
    auctions['auctions'].push(data)
    await firestore.collection('auctionsData').doc('auctions').set(auctions)
    await firestore.collection('currentPrices').doc(`${data.auctionId}`).set(productCurrentPrice)
    res.send('Auction saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const loadAuctions = async (req, res) => {
  try {
    const catalog = await firestore.collection('auctionsData').doc('auctions')
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

const fetchProduct = async (req, res) => {
  try {
    const productId = req.params.auctionId
    const catalog = await firestore.collection('auctionsData').doc('auctions')
    const data = await catalog.get()
    const productsArray = data.data().auctions
    const productData = productsArray.filter(product => product.auctionId === productId)

    if (!productData) {
      res.status(404).send('Product not found')
    } else {
      res.send(productData)
    }

  } catch (error) {
    res.status(400).send(error.message)
  }
}

const fetchCurrentPrice = async (req, res) => {
  try {
    const productId = req.params.auctionId
    const catalog = await firestore.collection('currentPrices').doc(productId)
    const data = await catalog.get()
    const currentPrice = data.data()

    if (!currentPrice) {
      res.status(404).send('Product not found')
    } else {
      res.send(currentPrice)
    }

  } catch (error) {
    res.status(400).send(error.message)
  }
}

const modificatedCurrentPrice = async (req, res) => {
  try {
    const token = req.headers.token
    const productId = req.params.auctionId
    const stepPrice = req.params.stepPrice
    const seePrice = req.params.seePrice

    const decodedToken = await admin.auth().verifyIdToken(token) //определяем какой юзер сделал запрос
    const email = decodedToken.email

    const userData = await firestore.collection('usersCash').doc(email).get()  //снимаем с кошелька сумупокупки
    const cash = userData.data()
    await firestore.collection('usersCash').doc(email).set({ cash: cash.cash - Number(seePrice) })

    const catalog = await firestore.collection('currentPrices').doc(productId)
    const data = await catalog.get()
    const currentPrice = data.data().currentPrice
    const newCurrentPrice = Number(currentPrice) - Number(stepPrice)
    await firestore.collection('currentPrices').doc(productId).set({ currentPrice: newCurrentPrice })
    res.send('Auction saved successfuly')

  } catch (error) {
    res.status(400).send(error.message)
  }
}

const addProfile = async (req, res) => {
  try {
    const data = req.body.profile
    const email = data.email
    await firestore.collection('profilesData').doc(email).set(data)
    res.send('Profile saved successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const fetchProfile = async (req, res) => {
  try {
    const email = req.params.email
    const catalog = await firestore.collection('profilesData').doc(email)
    const data = await catalog.get()
    const profile = data.data()

    if (!profile) {
      res.status(404).send('Profile not found')
    } else {
      res.send(profile)
    }

  } catch (error) {
    res.status(400).send(error.message)
  }
}

const fetchProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category
    const catalog = await firestore.collection('auctionsData').doc('auctions')
    const data = await catalog.get()
    const allProducts = data.data()
    if (category === 'all') {
      res.send(allProducts.auctions)

    } else {
      const products = allProducts.auctions.filter(product => product.category === category)
      if (!products) {
        res.status(404).send('Products not found')
      } else {
        res.send(products)
      }
    }
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const updateUserCash = async (req, res) => {
  try {
    const cash = req.body.cash
    const token = await req.body.token

    const decodedToken = await admin.auth().verifyIdToken(token) //определяем какой юзер сделал запрос
    const uid = decodedToken.uid

    const userDataHash = await firestore.collection('usersData').doc(uid).get()  //получаем БД юзеров
    const userData = userDataHash.data()

    const userCash = await firestore.collection('usersCash').doc(userData.email).get()  //Ищем в БД "кошелек" по емейлу
    const userCashData = userCash.data()

    if (userCashData === undefined) {     // если у юзера еще нет "кошелька" то создадим его
      await firestore.collection('usersCash').doc(userData.email).set({ cash: cash })
    } else {             //если "кошелек" есть то изменим его значение
      const totalCash = userCashData.cash + cash
      await firestore.collection('usersCash').doc(userData.email).set({ cash: totalCash })
      res.send({ cash: totalCash })
    }

  } catch
    (error) {
    res.status(400).send(error.message)
  }
}

const fetchUserCash = async (req, res) => {
  try {
    const email = req.body.email
    const token = await req.body.token

    const decodedToken = await admin.auth().verifyIdToken(token) //определяем какой юзер сделал запрос
    const uid = decodedToken.uid

    const userDataHash = await firestore.collection('usersData').doc(uid).get()  //получаем БД юзеров
    const userData = userDataHash.data()

    if (userData.email === email) {    //проверяем на валидность email юзера
      const userCash = await firestore.collection('usersCash').doc(userData.email).get()  //Ищем в БД "кошелек" по емейлу
      const userCashData = userCash.data()

      if (userCashData === undefined) {     // если у юзера еще нет "кошелька" то создадим его
        await firestore.collection('usersCash').doc(userData.email).set({ cash: 0 })
        res.send({ cash: 0 })
      } else {             //если "кошелек" есть то отправим его значение
        res.send(userCashData)
      }
    }
  } catch
    (error) {
    res.status(400).send(error.message)
  }
}

const buyProduct = async (req, res) => {
  try {
    const currentPrice = req.body.currentPrice
    const productData = req.body.productData
    const userData = req.body.userData
    const token = await req.body.token

    productData.isBuy = true
    productData.buyPrice = currentPrice

    const decodeToken = await admin.auth().verifyIdToken(token) //определяем какой юзер сделал запрос
    const uid = decodeToken.uid

    const userDataHash = await firestore.collection('usersData').doc(uid).get()  //получаем БД юзеров
    const userDataByDecodeToken = userDataHash.data()

    if (userDataByDecodeToken.email === userData.email) {    //проверяем на валидность юзера
      const userDataCash = await firestore.collection('usersCash').doc(userData.email).get()  //Ищем в БД "кошелек" по емейлу
      const userCashData = userDataCash.data()

      if (userCashData.cash >= Number(currentPrice)) {     // проверим что у юзера достаточно денег
        productData.isBuy = true
        productData.buyPrice = currentPrice
        productData.isSend = false
        productData.delivered = false
        const userCashAfterBuy = userCashData.cash - Number(currentPrice)
        await firestore.collection('usersCash').doc(userData.email).set({ cash: userCashAfterBuy }) //уменьшаем сумму в кошельке
        await firestore.collection('buyData').doc(productData.auctionId).set(productData)

        const userCartData = await firestore.collection('cartsData').doc(userData.email).get()  //получаем данные корзины
        let userCart = userCartData.data()
        if (userCart !== undefined) {
          userCart.auctions.push(productData)
        } else userCart = { auctions: [productData] }

        await firestore.collection('cartsData').doc(userData.email).set(userCart)  //добавляем товар в корзину

        const auctionsData = await firestore.collection('auctionsData').doc('auctions').get()
        const auctions = auctionsData.data()
        const newAuctions = auctions.auctions.map((auc) => {
          if (auc.auctionId === productData.auctionId) {
            auc.isInStock = false
            return auc
          }
          return auc
        })

        await firestore.collection('auctionsData').doc('auctions').set({ auctions: newAuctions })
        res.send({ status: 'good' })

      } else {
        res.status(400).send('Недостаточно денег')
      }

    } else {
      res.status(400).send('Пользователь не валидный')
    }

  } catch
    (error) {
    res.status(400).send(error.message)
  }
}

const fetchItemsInCart = async (req, res) => {
  try {
    const token = req.headers.token
    const decodedToken = await admin.auth().verifyIdToken(token) //определяем какой юзер сделал запрос
    const email = decodedToken.email

    const itemsData = await firestore.collection('cartsData').doc(email).get()  //Находим корзину по email
    const cartData = itemsData.data()
    res.send(cartData)

  } catch (error) {
    res.status(400).send(error.message)
  }
}

const writeDeliveryData = async (req, res) => {
  try {
    const token = req.body.token
    const deliveryInfo = req.body.deliveryData
    const productDataInfo = req.body.productData

    const decodedToken = await admin.auth().verifyIdToken(token) //определяем какой юзер сделал запрос
    const userEmail = decodedToken.email

    const deliveryData = {
      productName: productDataInfo.productName,
      productId: productDataInfo.auctionId,
      productDescription: productDataInfo.description,
      productImages: productDataInfo.photoUrlsData,
      userName: deliveryInfo.name,
      surName: deliveryInfo.surname,
      tel: deliveryInfo.tel,
      region: deliveryInfo.region,
      city: deliveryInfo.city,
      email: userEmail
    }

    //------Добавление в ожидающие посылки------//
    const deliveriesByEmail = await firestore.collection('waitingToSendProducts').doc(userEmail).get()  //Находим корзину по email
    if (deliveriesByEmail.data() === undefined) {
      await firestore.collection('waitingToSendProducts').doc(userEmail).set({ products: [deliveryData] })
    } else {
      let deliveryDataFetching = deliveriesByEmail.data()
      deliveryDataFetching.products.push(deliveryData)
      await firestore.collection('waitingToSendProducts').doc(userEmail).set(deliveryDataFetching)
    }

    //------Удаление товара с корзины юзера------//
    const productsInCartData = await firestore.collection('cartsData').doc(userEmail).get()
    const productsInCart = productsInCartData.data()
    const productInCartFiltered = productsInCart.auctions.filter(auc => {
      if (auc.auctionId === deliveryData.productId) {
        return false
      } else return true
    })
    await firestore.collection('cartsData').doc(userEmail).set({ auctions: productInCartFiltered })
    res.status(200).send('OK')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const fetchWaitingToSendProducts = async (req, res) => {
  try {
    const token = req.headers.token
    const decodedToken = await admin.auth().verifyIdToken(token) //определяем какой юзер сделал запрос
    const userEmail = decodedToken.email

    //------Подгрузка ожидающих посылок------//
    const waitingDeliveriesByEmail = await firestore.collection('waitingToSendProducts').doc(userEmail).get()  //Находим корзину по email
    if (waitingDeliveriesByEmail.data() === undefined) {
      res.status(200).send('Waiting deliveries absent')
    } else {
      res.status(200).send(waitingDeliveriesByEmail.data())
    }
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const fetchAllWaitingToSendProducts = async (req, res) => {
  try {
    const token = req.headers.token
    const decodedToken = await admin.auth().verifyIdToken(token) //определяем какой юзер сделал запрос
    const userEmail = decodedToken.email
    const adminsQueryDocument = await firestore.collection('admins').doc('admins').get()
    const admins = await adminsQueryDocument.data().admin

    //------Проверка на наличие прав админа------//
    let isAdmin = false
    admins.forEach(el => {
      if (el.email === userEmail) isAdmin = true
    })

    //------Подгрузка всех ожидающих посылок------//
    if (isAdmin) {
      const waitingDeliveriesByEmail = await firestore.collection('waitingToSendProducts').get()  //Находим корзину по email
      const data = []
      waitingDeliveriesByEmail.docs.forEach(el => data.push(el.data()))
      const allDeliveries = []
      data.forEach(productArr => productArr.products.forEach(el => allDeliveries.push(el)))
      res.status(200).send(allDeliveries)
    } else res.status(200).send('you are not an admin')
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const sendDeliveryItemWithDeliveryStatus = async (req, res) => {
  try {
    const token = req.body.token
    const productData = req.body.productData

    const decodedToken = await admin.auth().verifyIdToken(token) //определяем какой юзер сделал запрос
    const userEmail = decodedToken.email

    const adminsQueryDocument = await firestore.collection('admins').doc('admins').get()
    const admins = await adminsQueryDocument.data().admin

    //------Проверка на наличие прав админа------//
    let isAdmin = false
    admins.forEach(el => {
      if (el.email === userEmail) isAdmin = true
    })

    //------Подгрузка ожидающих посылок------//
    const waitingDeliveriesByEmail = await firestore.collection('waitingToSendProducts').doc(userEmail).get()  //Находим корзину по email
    const waitingDeliveriesByEmailData = waitingDeliveriesByEmail.data()

    if (isAdmin) {
      const data = waitingDeliveriesByEmailData.products.map(el => {
        if (el.productId === productData.productId) return productData
        return el
      })

      //------Перезапись ожидающих посылок------//
      await firestore.collection('waitingToSendProducts').doc(userEmail).set({ products: data })
      res.status(200).send('OK')
    }
  } catch (error) {
    res.status(400).send(error.message)
  }
}

module.exports = {
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
  fetchUserCash,
  buyProduct,
  fetchItemsInCart,
  writeDeliveryData,
  fetchWaitingToSendProducts,
  fetchAllWaitingToSendProducts,
  sendDeliveryItemWithDeliveryStatus
}