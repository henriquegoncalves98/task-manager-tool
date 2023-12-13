/* eslint-disable dot-notation */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UserRole } = require('../models');

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['authorization'];

  if (!token) {
    // Access Denied
    return res.status(401).json({ message: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user_id = decoded.user_id;
    req.role = decoded.role;
  } catch (err) {
    // Access Denied
    return res.status(401).json({ message: 'Invalid Token' });
  }
  next();
};

const onlyManager = (req, res, next) => {
  if (req.role !== UserRole.MANAGER) {
    // Unauthorized
    return res.status(403).json({ message: `Route only available for ${UserRole.MANAGER}s` });
  }
  next();
};

const onlyTech = (req, res, next) => {
  if (req.role !== UserRole.TECH) {
    // Unauthorized
    return res.status(403).json({ message: `Route only available for ${UserRole.TECH}s` });
  }
  next();
};

module.exports = { verifyToken, onlyManager, onlyTech };
