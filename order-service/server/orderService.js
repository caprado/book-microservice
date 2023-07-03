const jwt = require('jsonwebtoken');
const { Order, OrderItem } = require('../models/orderModel');

const validateToken = (call) => {
  const metadata = call.metadata.getMap();
  
  const {authorization} = metadata;
  if (!authorization) {
    throw new Error('No Authorization token provided');
  }

  const token = authorization.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.placeOrder = async (call, callback) => {
  const transaction = await sequelize.transaction();
  try {
    const user = validateToken(call);
    const { totalAmount, orderItems } = call.request;

    const newOrder = await Order.create({
      userId: user.id,
      orderDate: new Date(),
      totalAmount: totalAmount
    }, { transaction });

    const items = orderItems.map(item => ({ ...item, orderId: newOrder.id }));
    await OrderItem.bulkCreate(items, { transaction });

    await transaction.commit();
    callback(null, { message: 'Order placed.', orderId: newOrder.id });
  } catch (error) {
    await transaction.rollback();
    callback(error);
  }
};

exports.getOrder = async (call, callback) => {
  try {
    validateToken(call);
    const { id } = call.request;
    
    const order = await Order.findOne({ where: { id: id }, include: OrderItem });
    if (!order) {
      callback({ code: grpc.status.NOT_FOUND, details: "Order not found" });
    } else {
      callback(null, order);
    }
  } catch (error) {
    callback(error);
  }
};

exports.getAllOrders = async (call, callback) => {
  try {
    const user = validateToken(call);
    const orders = await Order.findAll({ where: { userId: user.id }, include: OrderItem });
    callback(null, { orders });
  } catch (error) {
    callback(error);
  }
};

exports.updateOrder = async (call, callback) => {
  const transaction = await sequelize.transaction();
  try {
    const user = validateToken(call);
    const { id, totalAmount, orderItems } = call.request;

    const order = await Order.findOne({ where: { id: id } }, { transaction });
    if (!order) {
      await transaction.rollback();
      callback({ code: grpc.status.NOT_FOUND, details: "Order not found" });
    } else if (order.userId !== user.id) {
      await transaction.rollback();
      callback({ code: grpc.status.PERMISSION_DENIED, details: "Access denied" });
    } else {
      await order.update({ totalAmount: totalAmount }, { transaction });
      await OrderItem.destroy({ where: { orderId: order.id } }, { transaction });

      const items = orderItems.map(item => ({ ...item, orderId: order.id }));
      await OrderItem.bulkCreate(items, { transaction });
      await transaction.commit();
      callback(null, { message: 'Order updated.' });
    }
  } catch (error) {
    await transaction.rollback();
    callback(error);
  }
};
