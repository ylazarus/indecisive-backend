const express = require('express')
const router = express.Router()

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
router.put('/:id', updateDish)
router.delete('/:id', removeDish)

module.exports = router
