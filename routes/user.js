const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const {verifyToken} = require('../authentication/userAuth')
const {
    signup,
    login,
    updateAccount,
    getAccount,
    logout
} = require('../controllers/userController')


/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Signs up a new user
 *     description: Creates an account for a new user
 *     comsumes:
 *       - application/json
 *     produces: 
 *       - application/json
 *     parameters:
 *     - in: body
 *       name: user_sign_up_details
 *       schema: 
 *         type: object
 *         properties: 
 *           username:
 *             type: string
 *             required: true
 *           email:
 *             type: string
 *             required: true
 *           password:
 *             type: string
 *             required: true
 *     responses:
 *       201: 
 *         description: Your account has been created successfully
 *         schema: 
 *           type: object
 *           properties: 
 *             message:
 *               type: string
 *       400:
 *         description: Please enter a valid email address and password
 *         schema:
 *           type: object
 *           properties:
 *             errno:
 *               type: string
 *             message:
 *               type: string
 *       500:
 *         description: An error occurred while creating the user's account
 *         schema:
 *           type: object
 *           properties:
 *             errno: 
 *               type: string
 *             message:
 *               type: string
 */


router.post(
    '/register', 
    body('email').isEmail(), 
    body('password')
    .isLength({min: 8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/), 
    signup
    );


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Logs in a user
 *     description: Logs in a user into their account using their email and password.
 *     comsumes:
 *       - application/json
 *     produces: 
 *       - application/json
 *     parameters:
 *     - in: body
 *       name: user_login_details
 *       schema: 
 *         type: object
 *         properties: 
 *           email:
 *             type: string
 *             required: true
 *           password:
 *             type: string
 *             required: true
 *     responses:
 *       200: 
 *         description: You have successfully logged in.
 *         schema: 
 *           type: object
 *           properties: 
 *             message:
 *               type: string
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 email: 
 *                   type: string
 *             token:
 *               type: string
 *       401:
 *         description: Please enter email and password
 *         schema:
 *           type: object
 *           properties:
 *             errno:
 *               type: string
 *             message:
 *               type: string
 *       400:
 *         description: Please enter a valid email address
 *         schema:
 *           type: object
 *           properties:
 *             errno:
 *               type: string
 *             message:
 *               type: string
 *       500:
 *         description: An error occurred while logging in user
 *         schema:
 *           type: object
 *           properties:
 *             errno: 
 *               type: string
 *             message:
 *               type: string
 */

router.post('/login', body('email').isEmail(), login);

router.get('/profile', verifyToken, getAccount);


/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Updates profile
 *     description: Updates user's account details
 *     comsumes:
 *       - application/json
 *     produces: 
 *       - application/json
 *     parameters:
 *     - in: body
 *       name: user's_new_details
 *       schema: 
 *         type: object
 *         properties:
 *           username:
 *             type: string
 *             required: true
 *           email:
 *             type: string
 *             required: true
 *     responses:
 *       200: 
 *         description: Your profile has been updated!.
 *         schema: 
 *           type: object
 *           properties: 
 *             message:
 *               type: string
 *             details:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   username:
 *                     type: string
 *                   email: 
 *                     type: string
 *       400:
 *         description: Email already exists
 *         schema:
 *           type: object
 *           properties:
 *             errno:
 *               type: string
 *             message:
 *               type: string
 *       401:
 *         description: Please enter all required fields
 *         schema:
 *           type: object
 *           properties:
 *             errno:
 *               type: string
 *             message:
 *               type: string
 *       500:
 *         description: Error updating user's account
 *         schema:
 *           type: object
 *           properties:
 *             errno: 
 *               type: string
 *             message:
 *               type: string
 */

router.put('/profile', verifyToken, updateAccount);

router.post('/logout', verifyToken, logout)

module.exports = router;