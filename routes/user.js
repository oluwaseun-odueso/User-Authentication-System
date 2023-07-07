const express = require('express');
const router = express.Router();
const {verifyToken} = require('../authentication/userAuth')
require('dotenv').config()
const {
    signup,
    login,
    updateAccount,
    getAccount,
    logout
} = require('../controllers/userController');

router.post('/register', signup)

router.post('/login', login);

router.get('/profile', verifyToken, getAccount);

router.put('/profile', verifyToken, updateAccount);

router.post('/logout', verifyToken, logout)

module.exports = router;