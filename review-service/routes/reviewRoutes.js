const express = require('express');
const { check } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const authorize = require('../middlewares/auth');
const router = express.Router();

router.post(
  '/review',
  authorize,
  [
    check('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    check('review').isLength({ min: 1 }).withMessage('Review must not be empty')
  ],
  reviewController.createReview
);
router.get('/review/:id', authorize, reviewController.getReview);
router.get('/reviews', authorize, reviewController.getAllReviews);
router.put(
  '/review/:id',
  authorize,
  [
    check('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    check('review').optional().isLength({ min: 1 }).withMessage('Review must not be empty')
  ],
  reviewController.updateReview
);
router.delete('/review/:id', authorize, reviewController.deleteReview);
