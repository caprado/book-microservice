const bookModel = require('../models/bookModel');

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
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

exports.createBook = async (req, res) => {
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
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await bookModel.remove(req.params.id);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};
