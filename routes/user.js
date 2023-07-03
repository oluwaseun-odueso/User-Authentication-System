const express = require('express');
const router = express.Router();
const {body} = require('express-validator')

const {verifyToken} = require('../authentication/userAuth')
const {
    signup,
    login,
    updateAccount
} = require('../controllers/userController')

router.post(
    '/signup', 
    body('email').isEmail(), 
    body('password')
    .isLength({min: 8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/), 
    signup);
router.post('/login', body('email').isEmail(), login);
router.get('/get_account', verifyToken, getAccount)
router.put('/update_account', verifyToken, updateAccount);
router.delete('/delete_account', verifyToken, deleteAccount);

module.exports = router;