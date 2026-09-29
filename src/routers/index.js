const { Router } = require('express');

const authorRouter = require('./authorRouter');
const bookRouter = require('./bookRouter');

const router = new Router();

router.use('/authors', authorRouter);
router.use('/books', bookRouter);

module.exports = router;
