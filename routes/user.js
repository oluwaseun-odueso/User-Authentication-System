const express = require('express');
const router = express.Router();
const {body} = require('express-validator')

const {verifyToken} = require('../authentication/userAuth')
const {
    signup,
    login,
    updateAccount,
    getAccount,
} = require('../controllers/userController')

router.post(
    '/register', 
    body('email').isEmail(), 
    body('password')
    .isLength({min: 8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/), 
    signup);
router.post('/login', body('email').isEmail(), login);
router.get('/profile', verifyToken, getAccount)
router.put('/profile', verifyToken, updateAccount);
router.post

module.exports = router;