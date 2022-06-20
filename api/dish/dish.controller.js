const dishService = require('./dish.service')

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
    console.log('dish id is: ', dishId);
    try {
        const dish = await dishService.getDishById(dishId)
        response.status(200).json(dish)
    } catch (error) {
        response.status(500).send(`can not get dish with id ${dishId} now`, error)
    }
}

module.exports = {
    getDishes,
    getDishById,
    // addDish,
    // updateDish,
    // removeDish,
  }

