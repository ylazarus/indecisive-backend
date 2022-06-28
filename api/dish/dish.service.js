// uses postgreSQL as DB

const { response } = require("express")
const pool = require('../../services/db.service')


async function query(filterBy) {
  // this app purposely returns a maximum of three results
  const SQLquery = _buildSQLquery(filterBy)
  try {
    const results = await pool.query(SQLquery)
    return results.rows
  } catch (error) {
    response.status(500).send("can not get dishes now", error)
  }
}

async function getDishById (dishId) {
    try {
        const results = await pool.query(`SELECT * FROM dishes WHERE id = '${dishId}'`)
        return results.rows // returns an array with length of 1, handled in frontend
    } catch (error) {
        throw error
    }
  
}

async function addDish (dish) {
  const { title, type, onePot, kosherStatus, difficult, quick, time, link, addedById } = dish
  let alreadyInDB = 1
  alreadyInDB = await _checkIfInDB(title)
  if (alreadyInDB) {
    console.log('already in DB');
    throw error
  }
  try {
    await pool.query(
        `INSERT INTO dishes (id, title, type, one_pot, kosher_status, difficult, quick, time, link, added_by_id)
         VALUES (uuid_generate_v4(), '${title}', '${type}', ${onePot}, '${kosherStatus}', ${difficult}, ${quick}, ${time}, '${link}', '${addedById}')`)
  } catch (error) {
    throw error
  }
}

async function updateDish (dishId, dish){
  const {title, type, one_pot, kosher_status, difficult, quick, time, link, addedById } = dish
  try {
    await pool.query(
        `UPDATE dishes SET title = '${title}', type = '${type}', one_pot = ${one_pot}, 
                  kosher_status = '${kosher_status}', difficult = ${difficult}, quick = ${quick},
                  time = ${time}, link = '${link}', added_by_id = '${addedById}' WHERE id = '${dishId}'`)
  } catch (error) {
    throw error
  }
}

async function removeDish(dishId) {
    try {
        pool.query(`DELETE FROM dishes WHERE id = '${dishId}'`)
    } catch (error) {
        throw error
    }
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
  query,
  getDishById,
  addDish,
  updateDish,
  removeDish,
}
