const express = require('express');
const router = express.Router();

const {
    signUp
} = require('../controllers/userController').default

router.post('/signup', signUp);
router.post('/login', login);
router.put('/update_account', updateAccount);
router.delete('/delete_account', deleteAccount);

module.exports = router;