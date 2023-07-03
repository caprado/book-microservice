const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');  // updated this line

const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publishedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false
});

module.exports = { Book };


// exports.findAll = async () => {
//     const result = await db.query('SELECT * FROM Book');
//     return result.rows;
// };

// exports.findById = async (id) => {
//     const result = await db.query('SELECT * FROM Book WHERE id = $1', [id]);
//     return result.rows[0];
// };

// exports.create = async (bookData) => {
//     const result = await db.query(
//         'INSERT INTO Book (title, author, publishedDate, summary, price, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
//         [bookData.title, bookData.author, bookData.publishedDate, bookData.summary, bookData.price, bookData.quantity]
//     );
//     return result.rows[0];
// };

// exports.update = async (id, bookData) => {
//     const result = await db.query(
//         'UPDATE Book SET title = $1, author = $2, publishedDate = $3, summary = $4, price = $5, quantity = $6 WHERE id = $7 RETURNING *',
//         [bookData.title, bookData.author, bookData.publishedDate, bookData.summary, bookData.price, bookData.quantity, id]
//     );
//     return result.rowCount ? result.rows[0] : null;
// };

// exports.remove = async (id) => {
//     const result = await db.query('DELETE FROM Book WHERE id = $1 RETURNING *', [id]);
//     return result.rowCount;
// };
