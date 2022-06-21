require('dotenv').config()
const express = require("express")
const cors = require("cors")
const path = require('path')
const bodyParser = require("body-parser")

const app = express()
const http = require('http').createServer(app)


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
 
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  const corsOptions = {
      origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
      credentials: true
  }
  app.use(cors(corsOptions))
}

const dishRoutes = require('./api/dish/dish.routes')

app.use('/api/dish', dishRoutes)

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const port = process.env.PORT || 3030
http.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
