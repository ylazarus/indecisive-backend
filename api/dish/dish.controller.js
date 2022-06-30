const dishService = require('./dish.service')
const logger = require('../../services/logger.service')

async function getDishes(request, response) {
    try {
        let filterBy = request.query
        const dishes = await dishService.query(filterBy)
        response.status(200).json(dishes)
    } catch (error) {
        response.status(500).send("can not get dishes now", error)
    }
}

async function getDishById(request, response) {
    let dishId = request.params.id
    try {
        const dish = await dishService.getDishById(dishId)
        response.status(200).json(dish)
    } catch (error) {
        response.status(500).send(`can not get dish with id ${dishId} now`, error)
    }
}

async function addDish(request, response) {
    try {
        const dish = request.body
        await dishService.addDish(dish)
        response.status(201).send('dish added successfully')
    } catch (error) {
        response.status(500).send("Dish with that title already exists!")
    } 
}

async function updateDish(request, response) {
    const dishId = request.params.id
    const dish = request.body
    try {
        await dishService.updateDish(dishId, dish)
        response.status(201).send('dish updated successfully')
    } catch (error) {
        console.log('failed to update', error);
        response.status(500).send('can not update dish now')
    }
}

async function removeDish(request, response) {
    try {
        const dishId = request.params.id
        await dishService.removeDish(dishId)
        response.status(201).send('dish deleted successfully')
    } catch (error) {
        response.status(500).send('can not delete dish now')
    }
}

module.exports = {
    getDishes,
    getDishById,
    addDish,
    updateDish,
    removeDish,
  }

