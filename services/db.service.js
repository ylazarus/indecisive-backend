const Pool = require("pg").Pool
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

pool.connect((err) => {
  if (err) throw new Error("postgreSQL failed connection")
  console.log("connected to postgreSQL")
})

module.exports = {
    query: (text) => pool.query(text)
  }