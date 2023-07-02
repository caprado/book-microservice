const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  bookId: { type: String, required: true }, // foreign key to Book.id in PostgreSQL
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
