const {Sequelize, DataTypes} = require('sequelize')
const sequelize = require("../config/db");

const tamplateTable = sequelize.define(
    'Tamplate',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        content:{
            type:DataTypes.TEXT,
            allowNull:false,

        }
    },{
        timestamps:true,
    }
)
sequelize.sync()
module.exports = tamplateTable;

