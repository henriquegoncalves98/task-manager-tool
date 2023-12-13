require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./api');
const logger = require('./logger');
const { connectQueue } = require('../publisher');

const PORT = process.env.PORT || 9999;
const app = express();
// connect rabbitMQ queue
connectQueue();

app.use(express.urlencoded({ extended: 'false' }));
app.use(express.json());
app.use(cors());
app.use('/api/v1', router);

app.listen(PORT, async () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;
