const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Sequelize } = require('sequelize');
require('dotenv').config();
const orderService = require('./server/orderService');
const path = require('path');

const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: 'postgres'
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected...');
    
    sequelize.sync()
      .then(() => console.log('Tables created...'))
      .catch(err => console.error('Unable to create tables:', err));
  })
  .catch(err => console.error('Unable to connect to the database:', err));

const PROTO_PATH = path.resolve(__dirname, './proto/order.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const orderProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(orderProto.OrderService.service, orderService);

server.bindAsync(`0.0.0.0:${process.env.PORT || 4000}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Listening on port ${process.env.PORT || 4000}...`);
  server.start();
});

module.exports = sequelize;
