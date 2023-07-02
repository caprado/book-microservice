const express = require('express');
const userController = require('../controllers/userController');
const { body } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  [
      body('email').isEmail().withMessage('Enter a valid email'),
      body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
  ],
  userController.registerUser
);

router.post('/login', userController.loginUser);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);

module.exports = router;
