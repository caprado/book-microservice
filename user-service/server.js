const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
require('dotenv').config();
const userService = require('./server/userService');
const path = require('path');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

const PROTO_PATH = path.resolve(__dirname, './proto/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(userProto.UserService.service, userService);

server.bindAsync('localhost:' + process.env.PORT, grpc.ServerCredentials.createInsecure(), () => {
  console.log('Server running at http://localhost:' + process.env.PORT);
  server.start();
});
