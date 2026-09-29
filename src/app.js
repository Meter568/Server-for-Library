const express = require('express');
const cors = require('cors');
const { validationErrorHandler, errorHandler } = require('./middleware/errorHandler.mw');

const router = require('./routers');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(validationErrorHandler);
app.use(errorHandler);

module.exports = app;
