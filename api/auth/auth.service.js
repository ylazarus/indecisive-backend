const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)
    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    // user.id = user.id.toString()
    return user
}
    

async function signup(username, password, fullname ) {
    const saltRounds = 10

    if (!username || !password || !fullname ) return Promise.reject('fullname, username and password are required!')

    const userExist = await userService.getByUsername(username)
    if (userExist) return Promise.reject('Username already taken')

    const hash = await bcrypt.hash(password, saltRounds)
    const user = { username, password: hash, fullname }
    return userService.add(user)
}

module.exports = {
    signup,
    login
}