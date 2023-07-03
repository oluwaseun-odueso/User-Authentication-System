const {DataTypes, Model} = require('sequelize');
const sequelize = require('../database/db');

class User extends Model {}

User.init({
    // Model attributes are defined here
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hashed_password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User' 
  });

console.log(User === sequelize.models.User); // true