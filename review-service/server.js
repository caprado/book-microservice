const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
require('dotenv').config();
const reviewService = require('./server/reviewService');
const path = require('path');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
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

const PROTO_PATH = path.resolve(__dirname, './proto/review.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const reviewProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(reviewProto.ReviewService.service, reviewService);

server.bindAsync('localhost:' + process.env.PORT, grpc.ServerCredentials.createInsecure(), () => {
  console.log('Server running at http://localhost:' + process.env.PORT);
  server.start();
});
