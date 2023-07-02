const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authorize = require('../middlewares/auth');

router.post('/order', authorize, orderController.placeOrder);
router.get('/order/:id', authorize, orderController.getOrder);
router.get('/orders', authorize, orderController.getAllOrders);
router.put('/order/:id', authorize, orderController.updateOrder);
router.delete('/order/:id', authorize, orderController.cancelOrder);

module.exports = router;
