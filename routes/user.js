const express = require('express');
const router = express.Router();
const {verifyToken} = require('../authentication/userAuth')
const limiter = require('../middlewares/methodAndRateLimit')
require('dotenv').config()
const {
    signup,
    login,
    updateAccount,
    getAccount,
    logout
} = require('../controllers/userController');

// The limiter middleware reduces the number of times an IP address can call the register route
router.post('/register', limiter, signup)

router.post('/login', login);

router.get('/profile', verifyToken, getAccount);

router.put('/profile', verifyToken, updateAccount);

router.post('/logout', verifyToken, logout)

module.exports = router;