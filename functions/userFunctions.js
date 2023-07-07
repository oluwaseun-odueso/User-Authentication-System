const User = require('../model/user')
const bcrypt = require('bcrypt');
const emailValidator = require('email-validator')
const passwordValidator = require('password-validator')

//Password schema
const schema = new passwordValidator();
schema
.is().min(10)
.is().max(50)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()
.has().symbols()

async function createUser(userDetails) {
    try {
       const user = await User.create(userDetails)
       return JSON.parse(JSON.stringify(user))
    } catch (error) {
        throw new Error(`Error creating user: ${error}`)
    }
};

async function checkEmail (email) {
    try {
        const emailCheck = await User.findOne({
            where: { email }
        })
        return emailCheck ? true : false
    } catch (error) {
        throw new Error(`Error checking if email exists: ${error}`)
    };
};

async function checkUsername(username) {
    try{
        const usernameNumberCheck = await User.findOne({
            where: { username }
        })
        return usernameNumberCheck ? true : false
    }
    catch (error) {
        throw new Error(`Error checking if username exists: ${error}`)
    }
};

async function getUserById(id) {
    try {
        const user = await User.findOne({
            attributes: {exclude: ['hashed_password']},
            where: {id}
        });
        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        throw new Error(`Error getting user by id: ${error}`)
    }
};

async function getUserByEmail(email) {
    try {
        const user = await User.findOne({
            attributes: { exclude: ['hashed_password']},
            where: { email }
          });
        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        throw new Error(`Error getting user by email: ${error}`)
    }
};

async function retrieveHashedPassword(email) {
    try {
        const userPassword = await User.findOne({
            attributes: ["hashed_password"],
            where: {email}
        });
        return JSON.parse(JSON.stringify(userPassword)).hashed_password;
    } catch (error) {
        throw new Error(`Error retrieving user's password: ${error}`)
    };
};


async function confirmRetrievedPassword(password, hashedPassword) {
    try {
        const confirmPassword = await bcrypt.compare(password, hashedPassword)
        return confirmPassword;
    } catch (error) {
        throw new Error(`Error comfirming user's password: ${error}`)
    };
};

async function hashPassword (password) {
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        return hash
    } catch (error) {
        throw new Error(`Error hashing user's password: ${error}`);
    };
};


function checkIfEntriesMatch(firstValue, secondValue) {
    return firstValue === secondValue;
};

async function updateUserAccount(id, username, email) {
    try {
        const updatedDetails = await User.update({username, email}, {
            where: { id }
        });
        return updatedDetails
    } catch (error) {
        throw new Error(`Error updating user's details: ${error}`)
    };
};

const userFunctions = {
    schema,
    createUser,
    checkEmail,
    checkUsername,
    getUserByEmail,
    getUserById,
    hashPassword,
    retrieveHashedPassword,
    confirmRetrievedPassword,
    checkIfEntriesMatch,
    updateUserAccount,
}

module.exports = userFunctions;