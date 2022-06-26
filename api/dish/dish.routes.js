const express = require('express')
const router = express.Router()
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')


const {
    getDishes,
    getDishById,
    addDish,
    updateDish,
    removeDish,
  } = require ('./dish.controller')

router.get('/', getDishes)
router.get('/:id', getDishById)
router.post('/', addDish)
router.put('/:id', requireAuth, updateDish)
router.delete('/:id', requireAuth, requireAdmin, removeDish)

module.exports = router
