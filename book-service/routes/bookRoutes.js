const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authorize = require('../middlewares/auth');

router.get('/', authorize, bookController.getAllBooks);
router.get('/:id', authorize, bookController.getBookById);
router.post('/', authorize, bookController.createBook);
router.put('/:id', authorize, bookController.updateBook);
router.delete('/:id', authorize, bookController.deleteBook);

module.exports = router;
