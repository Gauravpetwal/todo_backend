const userTable = require ('../../models/users');
const { Op } = require('sequelize');
//const {sequelize} = require('sequelize')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validate = require('../../Helpers/Validator');
const response = require('../../Helpers/Response')


//Admin signin
const AdminSignIn = async(req,res)=>{
     const {AdminEmail,AdminPass} = req.body;
 try{
    const data={
        Email:AdminEmail,
        Password:AdminPass
    }
    const rules ={
        Email:'required|email',
        Password:'required'
    }

    const validationResponse = await validate(data,rules)
    if(validationResponse.status === 0){
        return response.failed(res,validationResponse.message,null)
    }

    const Admin = await userTable.findOne({where:{[Op.and]:[{email:AdminEmail}, {role:'admin'}]}})
    if(!Admin){
        return response.failed(res,"Wrong Email",null)
    }
    const isPasswordMatch = await bcrypt.compare(AdminPass, Admin.Password)
    if(!isPasswordMatch){
        return response.failed(res,"Wrong password",null)
    }
    const token = jwt.sign({id:Admin.id},process.env.JWT_SECRET,{ expiresIn: "4h"})
      return response.success(res,"Login successfully",token)
   
 } catch (error) {
     return response.failed(res,"Error occured during login",null)
  }
}

module.exports = AdminSignIn;