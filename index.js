const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const placeRoutes = require('./src/routes/routes')
const cookieParser = require('cookie-parser')
const addUserCheckRole = require('./src/middleware/addUserCheckRole')
const fetchCurrentPriceCheckRole = require('./src/middleware/fetchCurrentPriceCheckRole')
require("dotenv").config()

// const addReviewCheckRole = require('./src/middleware/addReviewCheckRole')
const app = express()

const PORT = 5000

app.use(express.json())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(bodyParser.json())
app.use(cookieParser())




app.post('api/add-auction', addUserCheckRole)
app.post('api/add-profile', addUserCheckRole)
app.get('api/fetch-currentPrice/:auctionId', fetchCurrentPriceCheckRole)
// app.post('/api/add-video', updateContentCheckRole)
// app.post('/api/add-review', addReviewCheckRole)

app.use('/api', placeRoutes.routes)

app.listen(process.env.PORT || 5000, () => console.log('App is listening on url http://localhost:' + PORT))