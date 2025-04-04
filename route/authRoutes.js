const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
} = require('../controller/authController');
const { verifyToken, verifyRefreshToken } = require('../middleware/auth');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', verifyRefreshToken, refresh);
router.post('/logout', verifyToken, logout);

module.exports = router;
