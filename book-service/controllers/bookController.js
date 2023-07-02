const bookModel = require('../models/bookModel');
const Joi = require('joi');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await bookModel.findAll();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await bookModel.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

exports.createBook = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().max(100).required(),
        author: Joi.string().max(100).required(),
        publishedDate: Joi.date().required(),
        summary: Joi.string().required(),
        price: Joi.number().precision(2).required(),
        quantity: Joi.number().integer().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const newBook = await bookModel.create(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const updatedBook = await bookModel.update(req.params.id, req.body);
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const deletedBook = await bookModel.remove(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};
