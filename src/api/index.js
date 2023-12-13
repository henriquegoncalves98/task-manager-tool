const express = require('express');
const router = express.Router();

const userApi = require('./users');
const taskApi = require('./tasks');

router.get('/health', (req, res) => {
  res.status(200).send('ok');
});

router.use('/users', userApi);
router.use('/tasks', taskApi);

module.exports = router;
