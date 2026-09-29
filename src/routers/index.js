const { Router } = require('express');

const authorRouter = require('./authorRouter');

const router = new Router();

router.use('/authors', authorRouter);

module.exports = router;
