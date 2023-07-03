const jwt = require('jsonwebtoken');
const Review = require('../models/reviewModel');

const validateToken = (call) => {
  const metadata = call.metadata.getMap();

  const { authorization } = metadata;
  if (!authorization) {
    throw new Error('No Authorization token provided');
  }

  const token = authorization.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  return jwt.verify(token, secret);
};

exports.GetReview = async (call, callback) => {
  try {
    validateToken(call);
    const { id } = call.request;

    const review = await Review.findById(id);
    if (!review) {
      callback({ code: grpc.status.NOT_FOUND, details: "Review not found" });
    } else {
      callback(null, review);
    }
  } catch (error) {
    callback(error);
  }
};

exports.UpdateReview = async (call, callback) => {
  try {
    const user = validateToken(call);

    const { id, userId, bookId, rating, review: newReview } = call.request;
    if (user.id !== userId) {
      callback({ code: grpc.status.PERMISSION_DENIED, details: "Access denied" });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      callback({ code: grpc.status.NOT_FOUND, details: "Review not found" });
    } else {
      review.bookId = bookId;
      review.rating = rating;
      review.review = newReview;
      const updatedReview = await review.save();
      callback(null, updatedReview);
    }
  } catch (error) {
    callback(error);
  }
};

exports.DeleteReview = async (call, callback) => {
  try {
    const user = validateToken(call);

    const { id, userId } = call.request;
    if (user.id !== userId) {
      callback({ code: grpc.status.PERMISSION_DENIED, details: "Access denied" });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      callback({ code: grpc.status.NOT_FOUND, details: "Review not found" });
    } else {
      await review.remove();
      callback(null, { message: 'Review deleted.' });
    }
  } catch (error) {
    callback(error);
  }
};

exports.GetAllReviews = async (call, callback) => {
  try {
    validateToken(call);

    const reviews = await Review.find({});
    callback(null, { reviews });
  } catch (error) {
    callback(error);
  }
};
