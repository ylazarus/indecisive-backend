require('dotenv').config()
const express = require("express")
const cors = require("cors")
const path = require('path')
const expressSession = require('express-session')
// const bodyParser = require("body-parser")

const app = express()
const http = require('http').createServer(app)


const session = expressSession({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
})
app.use(express.json({ limit: '50mb' }))
app.use(session)
 
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  const corsOptions = {
      origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
      credentials: true
  }
  app.use(cors(corsOptions))
}

const userRoutes = require('./api/user/user.routes')
const dishRoutes = require('./api/dish/dish.routes')
const authRoutes = require('./api/auth/auth.routes')

app.use('/api/user', userRoutes)
app.use('/api/dish', dishRoutes)
app.use('/api/auth', authRoutes)

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const port = process.env.PORT || 3030
http.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
