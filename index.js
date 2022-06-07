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
 
const corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true
}
app.use(cors(corsOptions))

const db = require ('./services/dishService')



app.get("/api/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" })
})
 
app.get('/api/dish', db.getDishes)
app.get('/api/dish/:id', db.getDishById)
app.post('/api/dish', db.addDish)
app.put('/api/dish/:id', db.updateDish)
app.delete('/api/dish/:id', db.removeDish)


const port = process.env.PORT || 3030
http.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
