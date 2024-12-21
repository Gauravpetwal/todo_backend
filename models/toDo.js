const {Sequelize, DataTypes} = require('sequelize')
const sequelize = require("../config/db");
const usermodel = require('./users')
const ToDo = sequelize.define(
   'ToDos',
   {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
    ToDoName:{
        type: DataTypes.STRING,
        allowNulls:false,        
    },
    UserId:{
      type:DataTypes.INTEGER,
      references:{
        model: usermodel,
        key: 'id'
      },
      onDelete: 'CASCADE' ,
      allowNull:false
    },
    status:{
      type:DataTypes.ENUM('completed','onGoing'),
      defaultValue:'onGoing'
      
    }
   },

   {
    timestamps: true,
   }
)

// Establish association
ToDo.belongsTo(usermodel, { foreignKey: 'UserId'});
usermodel.hasMany(ToDo, { foreignKey: 'UserId'});
ToDo.sync();

module.exports = ToDo;