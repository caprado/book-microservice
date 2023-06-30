const db = require('../db');

exports.findAll = async () => {
    const result = await db.query('SELECT * FROM Book');
    return result.rows;
};

exports.findById = async (id) => {
    const result = await db.query('SELECT * FROM Book WHERE id = $1', [id]);
    return result.rows[0];
};

exports.create = async (bookData) => {
    const result = await db.query(
        'INSERT INTO Book (title, author, publishedDate, summary, price, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [bookData.title, bookData.author, bookData.publishedDate, bookData.summary, bookData.price, bookData.quantity]
    );
    return result.rows[0];
};

exports.update = async (id, bookData) => {
    const result = await db.query(
        'UPDATE Book SET title = $1, author = $2, publishedDate = $3, summary = $4, price = $5, quantity = $6 WHERE id = $7 RETURNING *',
        [bookData.title, bookData.author, bookData.publishedDate, bookData.summary, bookData.price, bookData.quantity, id]
    );
    return result.rows[0];
};

exports.remove = async (id) => {
    await db.query('DELETE FROM Book WHERE id = $1', [id]);
};
