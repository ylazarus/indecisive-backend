const pool = require("../../services/db.service")
const logger = require("../../services/logger.service")

module.exports = {
  getUsers,
  getById,
  getDishesByUserId,
  getByUsername,
  remove,
  update,
  add,
}

async function getUsers() {
  try {
    const results = await pool.query("SELECT * FROM users")
    let users = results.rows
    users = users.map((user) => {
      delete user.password
      return user
    })
    return users
  } catch (err) {
    logger.error("cannot find users", err)
    throw err
  }
}

async function getById(userId) {
  try {
    const results = await pool.query(
      `SELECT * FROM users WHERE id = '${userId}'`
    )
    let users = results.rows
    users = users.map((user) => {
      delete user.password
      return user
    })
    return users // returns array length of 1
  } catch (err) {
    logger.error(`while finding user ${userId}`, err)
    throw err
  }
}

async function getDishesByUserId(userId) {
  try {
    const results = await pool.query(
      `SELECT b.title, b.kosher_status, b.id as dish_id, a.fullname AS added_by, a.id as user_id
      FROM users a LEFT OUTER JOIN dishes b
      ON a.id = b.added_by_id
      WHERE a.id = '${userId}'`
    )
    return results.rows
  } catch (error) {
    logger.error(`while finding dish by user id ${userId}`, error)
  }
}

async function getByUsername(username) {
  try {
    const results = await pool.query(
      `SELECT * FROM users WHERE username = '${username}'`
    )
    const users = results.rows
    return users[0]
  } catch (err) {
    logger.error(`while finding user ${username}`, err)
    throw err
  }
}

async function remove(userId) {
  try {
    pool.query(`DELETE FROM users WHERE id = '${userId}'`)
  } catch (err) {
    logger.error(`cannot remove user ${userId}`, err)
    throw err
  }
}

async function update(user, id) {
  const { username, isAdmin, fullname } = user

  if (!username || !fullname)
    return Promise.reject("fullname and username are required!")

  try {
    const userToSave = await pool.query(
      `UPDATE users SET username = '${username}', fullname = '${fullname}', is_admin = ${isAdmin} WHERE id = '${id}'`
    )
    console.log("saved successfully", userToSave)
    return userToSave
  } catch (err) {
    logger.error(`cannot update user ${user} `, err)
    throw err
  }
}

async function add(user) {
  const { username, password, fullname } = user
  console.log("trying to add user ", user)
  try {
    const results = await pool.query(
      `INSERT INTO users (id, username, password, fullname, is_admin)
        VALUES (uuid_generate_v4(), '${username}', '${password}', '${fullname}', false) RETURNING *`
    )
    return results.rows[0]
  } catch (err) {
    logger.error(`cannot insert user ${user} `, err)
    throw err
  }
}

// function _buildJoinQuery(filterBy) { // this is not ready yet, need to update later
//   let query = (filterBy.createdById) ? // may need to update
//   `SELECT * FROM dishes WHERE created_by_id = '${createdById}' ORDER BY title ASC` :
//   `SELECT * FROM dishes ORDER BY title ASC`
//   if (filterBy.userId) {
//     const txtCriteria = { $regex: filterBy.txt, $options: "i" }
//     query.$or = [
//       {
//         username: txtCriteria,
//       },
//       {
//         fullname: txtCriteria,
//       },
//     ]
//   }
//   return query
// }
