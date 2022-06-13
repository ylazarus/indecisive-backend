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

const db = require ('./services/dishService')



app.get('/api/dish', db.getDishes)
app.get('/api/dish/:id', db.getDishById)
app.post('/api/dish', db.addDish)
app.put('/api/dish/:id', db.updateDish)
app.delete('/api/dish/:id', db.removeDish)

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const port = process.env.PORT || 3030
http.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
