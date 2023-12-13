require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const logger = require('../logger');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      return res.status(400).json({ message: 'Email and Password input is required' });
    }
    // Validate if user exist in our database
    const user = await User.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user.id, email, role: user.role },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: '4h'
        }
      );

      // save user token
      user.token = token;

      return res.status(200).json(user);
    }

    return res.status(400).json({ message: 'Invalid Credentials' });
  } catch (err) {
    logger.error(err.sqlMessage || err.message || err.toString());
    res.status(400).json({ message: err.sqlMessage || err.message || err.toString() });
  }
});

module.exports = router;
