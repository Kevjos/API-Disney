'use strict';
module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: "The name can only contain letters"
        },
        len: {
          args: [2, 255],
          msg: "The name must be at least two characters"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "The email must be a valid email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: "The password must have at least 6 characters"
        }
      }
    },
  }, {
    tableName: "users",
    timestamps: false

  });

  return User;
};