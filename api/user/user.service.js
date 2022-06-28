const pool = require("../../services/db.service")
const bcrypt = require('bcrypt')
// const logger = require('../../services/logger.service')

module.exports = {
  getUsers,
  getById,
  getByUsername,
  remove,
  update,
  add,
}

// addUserTable()

// async function addUserTable() {
//     try {
//         await pool.query(`CREATE TABLE users (
//             id UUID PRIMARY KEY,
//             username VARCHAR(50) UNIQUE NOT NULL,
//             password VARCHAR(100) NOT NULL,
//             fullname VARCHAR(50) NOT NULL,
//             is_admin BOOL
//         )`)

//     } catch (error) {
//        console.log('error adding table', error)
//     }
// }

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
  console.log("updating user", user)
  const { username, isAdmin, fullname,  } = user

  if (!username || !fullname)
    return Promise.reject("fullname and username are required!")

  try {
    const userToSave = await pool.query(
      `UPDATE users SET username = '${username}', fullname = '${fullname}', is_admin = ${isAdmin} WHERE id = '${id}'`
    )
    console.log('saved successfully', userToSave);
    return userToSave
  } catch (err) {
    console.log(`cannot update user `, err)
    throw err
  }
}

async function add(user) {
  const { username, password, fullname } = user
  try {
    const results = await pool.query(
      `INSERT INTO users (id, username, password, fullname, is_admin)
        VALUES (uuid_generate_v4(), '${username}', '${password}', '${fullname}', false) RETURNING *`
    )
    return results.rows[0]
  } catch (err) {
    // logger.error("cannot insert user", err).
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
