const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getUser, getUsers, deleteUser, updateUser, getDishesByUser} = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', requireAuth, requireAdmin, getUsers)
router.get('/:id', requireAuth, getUser)
router.get('/dishes/:id', requireAuth, requireAdmin, getDishesByUser)
router.put('/:id', requireAuth, requireAdmin, updateUser)
router.delete('/:id',  requireAuth, requireAdmin, deleteUser)

// for development, require auths later
// router.put('/:id', updateUser)
// router.delete('/:id', deleteUser)

module.exports = router