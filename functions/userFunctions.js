// const {DataTypes} = require('sequelize')
// const userModel = require('../model/user')
// const bcrypt = require('bcrypt');
// const sequelize = require('../database/db');
// const User = userModel(sequelize, DataTypes)

const User = require('../models/user')
const bcrypt = require('bcrypt');

async function createUser(username, email, password) {
    try {
        const userDetails = {user_name, email, password}
        const user = await User.create(userDetails)
        return user
    } catch (error) {
        return error
    }
}

async function checkEmail (email) {
    try {
        const emailCheck = await User.findOne({
            where: { email }
        })
        return emailCheck ? true : false
    } catch (error) {
        return error
    }
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
}

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

async function hashUserPassword(password) {
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);   
        return hash 
    } catch (error) {
        return error
    }
}

const functions = {
    checkEmail,
    checkUsername,
    getUserById,
    getUserByEmail,
    hashUserPassword
};

module.exports = functions