const{Sequelize,DataTypes}= require('sequelize')
const sequelize = require("../config/db");
const { DATE } = require('sequelize/lib/data-types');
const otpTable = sequelize.define(
    "otp",
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        email:{
            type:DataTypes.STRING,
            require:true
        },
        otp: {
            type:DataTypes.STRING,
            required: true,
          },
          createdAt: {
            type:DATE,
            default: Date.now,
            expires: 60 * 5, 
          },

    }
)

sequelize.sync()
module.exports = otpTable;