const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
require('dotenv').config({ path: __dirname + '/../../.env' });

const bookService = require('./server/bookService');

const PROTO_PATH = path.resolve(__dirname, './proto/book.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const bookProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(bookProto.book.BookService.service, bookService);

server.bindAsync(`0.0.0.0:${process.env.BOOK_PORT || 4000}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Listening on port ${process.env.BOOK_PORT || 4000}...`);
  server.start();
});
