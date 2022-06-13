// uses postgreSQL as DB

const { response } = require("express")

const Pool = require("pg").Pool
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "dish",
  password: "password",
  port: 5432,
})

pool.connect((err) => {
  if (err) throw new Error("postgreSQL failed connection")
  console.log("connected to postgreSQL")
})

const getDishes = async (request, response) => {
  // this app purposely returns a maximum of three results
  let filterBy = request.query
  const SQLquery = _buildSQLquery(filterBy)
  try {
    const results = await pool.query(SQLquery)
    response.status(200).json(results.rows)
  } catch (error) {
    response.status(500).send("can not get dishes now", err)
  }
}

const getDishById = (request, response) => {
  const dishId = request.params.id
  pool.query(
    `SELECT * FROM dishes WHERE id = '${dishId}'`,
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

const addDish = async (request, response) => {
  const { title, type, onePot, kosherStatus, difficult, quick, time, link } =
    request.body
  let alreadyInDB = 1
  alreadyInDB = await _checkIfInDB(title)
  if (alreadyInDB) {
    response.status(500).send("Dish with that title already exists!")
    return
  }
  pool.query(
    `INSERT INTO dishes (id, title, type, one_pot, kosher_status, difficult, quick, time, link)
     VALUES (uuid_generate_v4(), '${title}', '${type}', ${onePot}, '${kosherStatus}', ${difficult}, ${quick}, ${time}, '${link}')`,
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`dish added successfully`)
    }
  )
}

const updateDish = (request, response) => {
  const dishId = request.params.id
  const { title, type, onePot, kosherStatus, difficult, quick, time, link } =
    request.body
  pool.query(
    `UPDATE dishes SET title = '${title}', type = '${type}', one_pot = ${onePot}, 
              kosher_status = '${kosherStatus}', difficult = ${difficult}, quick = ${quick},
              time = ${time}, link = '${link}' WHERE id = '${dishId}'`,
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`dish updated successfully`)
    }
  )
}

const removeDish = (request, response) => {
  const dishId = request.params.id
  pool.query(`DELETE FROM dishes WHERE id = '${dishId}'`, (error, results) => {
    if (error) {
      throw error
    }
    console.log(results)
    response.status(200).send("dish deleted successfully")
  })
}

function _buildSQLquery(filterBy) {
  const { kosherStatus, type } = filterBy
  const bothClause = kosherStatus && type ? "AND" : ""
  const whereClause = kosherStatus || type ? "WHERE" : ""
  const kosherQuery = kosherStatus ? `kosher_status = '${kosherStatus}'` : ""
  const typeQuery = type ? `type = '${type}'` : ""
  return `SELECT * FROM dishes ${whereClause} ${kosherQuery} ${bothClause} ${typeQuery} ORDER BY RANDOM() LIMIT 3`
}

async function _checkIfInDB(title) {
  try {
    const results = await pool.query(
      `SELECT FROM dishes WHERE title = '${title}'`
      )
      return results.rowCount > 0 ? true : false
  } catch (error) {
    console.log('failed to check if in DB', error);
  }
}

module.exports = {
  getDishes,
  getDishById,
  addDish,
  updateDish,
  removeDish,
}
