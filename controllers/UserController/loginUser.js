// const {sequelize} = require('sequelize')
const userTable = require("../../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const response = require('../../Helpers/Response')
const validate = require("../../Helpers/Validator");

//function for login the user
const login = async (req, res) => {
  const ipaddress= req.ip
  console.log(ipaddress)
  try {
    const { email, pass } = req.body;
    const data = {
      Email: email,
      Password: pass,
    };
    const rules = {
      Email: "required|email|isExist:users,email",
      Password: `required`,
    };

    const validationResponse = await validate(data, rules);
    if (validationResponse.status === 0) {
      return response.failed(res,validationResponse.message,null) 
    }

    const user = await userTable.findOne({ where: { email: email } });
    const confirmPassword = await bcrypt.compare(pass, user.Password);

    if (!confirmPassword) {
      return response.failed(res,"Password is incorrect",null)    
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "4h", });
   return response.success(res,validationResponse.message,token)
  }
   catch (error) {
    return response.failed(res,error,null)
    }
};

module.exports = login;
