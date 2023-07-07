const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const userService = require('./server/userService');
const path = require('path');
require('dotenv').config({ path: __dirname + '/../../.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.USER_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected.');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

const PROTO_PATH = path.resolve(__dirname, './proto/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(userProto.user.UserService.service, userService);

server.bindAsync(`0.0.0.0:${process.env.USER_PORT || 4000}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Listening on port ${process.env.USER_PORT || 4000}...`);
  server.start();
});
