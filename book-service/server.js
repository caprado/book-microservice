const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Sequelize } = require('sequelize');
require('dotenv').config();
const bookService = require('./server/bookService');
const path = require('path');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
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

const PROTO_PATH = path.resolve(__dirname, './proto/book.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const bookProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(bookProto.book.BookService.service, bookService);

server.bindAsync(`0.0.0.0:${process.env.PORT || 4000}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Listening on port ${process.env.PORT || 4000}...`);
  server.start();
});

module.exports = sequelize;
