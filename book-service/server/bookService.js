const bookModel = require('../models/bookModel');
const Joi = require('joi');
const { Status } = require('grpc');
const jwt = require('jsonwebtoken');

const validateToken = (call) => {
  const metadata = call.metadata.getMap();
  
  const {authorization} = metadata;
  if (!authorization) {
    throw new Error('No Authorization token provided');
  }

  const token = authorization.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.getAllBooks = async (call, callback) => {
    try {
        validateToken(call);
        
        const books = await bookModel.findAll();
        callback(null, { books });
    } catch (error) {
        callback({
            code: Status.INTERNAL,
            message: error.toString(),
        });
    }
};

exports.getBookById = async (call, callback) => {
    try {
        validateToken(call);

        const book = await bookModel.findById(call.request.id);
        if (!book) {
            return callback({
                code: Status.NOT_FOUND,
                message: 'Book not found',
            });
        }
        callback(null, book);
    } catch (error) {
        callback({
            code: Status.INTERNAL,
            message: error.toString(),
        });
    }
};

exports.createBook = async (call, callback) => {
    const schema = Joi.object({
        title: Joi.string().max(100).required(),
        author: Joi.string().max(100).required(),
        publishedDate: Joi.date().required(),
        summary: Joi.string().required(),
        price: Joi.number().precision(2).required(),
        quantity: Joi.number().integer().required(),
    });

    const { error } = schema.validate(call.request);
    if (error) {
        return callback({
            code: Status.INVALID_ARGUMENT,
            message: error.details[0].message,
        });
    }

    try {
        validateToken(call);
        const newBook = await bookModel.create(call.request);
        callback(null, newBook);
    } catch (error) {
        callback({
            code: Status.INTERNAL,
            message: error.toString(),
        });
    }
};

exports.updateBook = async (call, callback) => {
    try {
        validateToken(call);

        const updatedBook = await bookModel.update(call.request.id, call.request);
        if (!updatedBook) {
            return callback({
                code: Status.NOT_FOUND,
                message: 'Book not found',
            });
        }
        callback(null, updatedBook);
    } catch (error) {
        callback({
            code: Status.INTERNAL,
            message: error.toString(),
        });
    }
};

exports.deleteBook = async (call, callback) => {
    try {
        validateToken(call);

        const deletedBook = await bookModel.remove(call.request.id);
        if (!deletedBook) {
            return callback({
                code: Status.NOT_FOUND,
                message: 'Book not found',
            });
        }
        callback(null, { message: 'Book deleted successfully' });
    } catch (error) {
        callback({
            code: Status.INTERNAL,
            message: error.toString(),
        });
    }
};
