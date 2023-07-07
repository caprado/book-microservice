const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
require('dotenv').config({ path: __dirname + '/../../.env' });

const orderService = require('./server/orderService');

const PROTO_PATH = path.resolve(__dirname, './proto/order.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const orderProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(orderProto.order.OrderService.service, orderService);

server.bindAsync(`0.0.0.0:${process.env.ORDER_PORT || 4000}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Listening on port ${process.env.ORDER_PORT || 4000}...`);
  server.start();
});
