const { Router } = require('express');

const customerController = require('../controllers/customerController');
const { validateCustomer } = require('../middleware/validate.mw');

const router = new Router();

router
    .route('/')
    .get(customerController.getCustomers)
    .post(validateCustomer, customerController.createCustomer)
    .put(validateCustomer, customerController.updateCustomer);

router
    .route('/:customerId')
    .get(customerController.getCustomerById)
    .delete(customerController.deleteCustomer);

module.exports = router;