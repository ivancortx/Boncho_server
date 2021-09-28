const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
// const holidayStudioRoutes = require('./src/routes/routes')
// const updateContentCheckRole = require('./src/middleware/updateContentCheckRole')
require("dotenv").config()

// const addReviewCheckRole = require('./src/middleware/addReviewCheckRole')
const app = express()

const PORT = 5000

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

// app.post('/api/add-photo', updateContentCheckRole)
// app.post('/api/add-video', updateContentCheckRole)
// app.post('/api/add-review', addReviewCheckRole)

// app.use('/api', holidayStudioRoutes.routes)

app.listen(process.env.PORT || 5000, () => console.log('App is listening on url http://localhost:' + PORT))