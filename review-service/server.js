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

server.addService(reviewProto.review.ReviewService.service, reviewService);

server.bindAsync(`0.0.0.0:${process.env.PORT || 4000}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Listening on port ${process.env.PORT || 4000}...`);
  server.start();
});
