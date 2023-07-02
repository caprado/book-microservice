const Review = require('../models/reviewModel');

exports.createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { rating, review } = req.body;

    // Extract userId and bookId from request
    const userId = req.user.id; // Assuming JWT is verified and user object is attached to req
    const { bookId } = req.params;

    const newReview = new Review({
      userId,
      bookId,
      rating,
      review
    });

    const savedReview = await newReview.save();

    res.status(201).json({ message: 'Review created.', review: savedReview });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

exports.updateReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { rating, review: newReview } = req.body;

    review.rating = rating;
    review.review = newReview;

    await review.save();

    res.status(200).json({ message: 'Review updated.', review });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    await review.remove();

    res.status(200).json({ message: 'Review deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
