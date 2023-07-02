const { Order, OrderItem } = require('../models/orderModel');
const { sequelize } = require('../models');

exports.placeOrder = async (req, res) => {
  try {
    const newOrder = await Order.create({
      userId: req.user.id,  // User's id from the JWT payload
      orderDate: new Date(),
      totalAmount: req.body.totalAmount
    });

    // Add the order items
    const orderItems = req.body.orderItems.map(item => ({ ...item, orderId: newOrder.id }));
    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({ message: 'Order placed.', orderId: newOrder.id });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id }, include: OrderItem });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.user.id }, include: OrderItem });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

exports.updateOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const order = await Order.findOne({ where: { id: req.params.id } }, { transaction: t });
    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.userId !== req.user.id) {
      await t.rollback();
      return res.status(403).json({ message: 'Access denied.' });
    }

    await order.update({ totalAmount: req.body.totalAmount }, { transaction: t });

    // delete old items
    await OrderItem.destroy({ where: { orderId: order.id } }, { transaction: t });

    // add new items
    const orderItems = req.body.orderItems.map(item => ({ ...item, orderId: order.id }));
    await OrderItem.bulkCreate(orderItems, { transaction: t });

    await t.commit();

    res.status(200).json({ message: 'Order updated.' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.toString() });
  }
};
