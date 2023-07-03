// const {DataTypes} = require('sequelize')
// const userModel = require('../model/user')
// const bcrypt = require('bcrypt');
// const sequelize = require('../database/db');
// const User = userModel(sequelize, DataTypes)

const User = require('../models/user')
const bcrypt = require('bcrypt');

async function createUser(username, email, password) {
    try {
        const emailCheck = await User.findOne({
            where: { email }
        })
        return emailCheck ? true : false
    } catch (error) {
        return error
    }
};

async function checkEmail (email) {
    try {
        const emailCheck = await User.findOne({
            where: { email }
        })
        return emailCheck ? true : false
    } catch (error) {
        throw new Error(`Error checking if user's email exists: ${error}`)
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
        return error
    }
};

async function getUserById(id) {
    try {
        const details = await User.findOne({
            attributes: {exclude: ['password', 'image_key']},
            where: {id}
        });
        return details
    } catch (error) {
        return error   
    }
};

async function getUserByEmail(email) {
    try {
        const result = await User.findOne({
            attributes: { exclude: ['password' ,'image_key']},
            where: { email }
          });
        return result
    } catch (error) {
        return error
    }
};

async function retrieveHashedPassword(email) {
    try {
        const buyerPassword = await User.findOne({
            attributes: ["hashed_password"],
            where: {email}
        });
        return JSON.parse(JSON.stringify(buyerPassword)).hashed_password;
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
        throw new Error(`Error hashing buyer's password: ${error}`);
    };
};


function checkIfEntriesMatch(firstValue, secondValue) {
    return firstValue === secondValue;
};

async function updateUserAccount(id, username, email) {
    try {
        const updatedDetails = await Buyer.update({username, email}, {
            where: { id }
        });
        return updatedDetails
    } catch (error) {
        throw new Error(`Error updating buyer's details: ${error}`)
    };
};


async function deleteUserAccount(id) {
    try {
        const deletedAccount = await User.destroy({
            where: {id}
        })
        return deletedAccount;
    } catch (error) {
        throw new Error(`Error deleting user's account: ${error}`)
    };
};


const userFunctions = {
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
    deleteUserAccount
}

module.exports = userFunctions;