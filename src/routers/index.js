const { Router } = require('express');

const authorRouter = require('./authorRouter');
const bookRouter = require('./bookRouter');
const customerRouter = require('./customerRouter');

const router = new Router();

router.use('/authors', authorRouter);
router.use('/books', bookRouter);
router.use('/customers', customerRouter);

module.exports = router;
