const {sequelize, where} = require('sequelize')
const userTable = require('../../models/users')
const bcrypt = require('bcrypt');

const {errorResponse,successResponse,serverErrorResponse} = require('../../Helpers/Response')
const sendMail = require("../EmailController/RegisterMail")
const tamplateTable = require("../../models/tamplate")
const Handlebars = require('handlebars');
const confirmationMail = require('../EmailController/ResetPassEmail');
const otpTable = require('../../models/otp');
const validate = require('../../Helpers/Validator'); 





//method for registring user in database
const Regiteruser = async (req, res) => {
  const { username, email, password, otp } = req.body;
  try {
    const userInformation={username,email,password,otp}
    const rules ={
      username:'required|between:2,20',
      email:'required|email|isUnique',
      password:'required|between:6,30'
    }
    const validation = await validate(userInformation,rules)
   if(validation.status === 0){
    return res.json(errorResponse(validation.message,{}))
   }
    const requestedUser = await otpTable.findOne({ where: { email: email } });
    if (requestedUser.otp !== otp) {
      await otpTable.destroy({ where: { otp: requestedUser.otp } });
      return res.json(errorResponse("Wrong OTP, send OTP again",{}));
    }
     const hashedPassword = await bcrypt.hash(password, 10);
    const ResgisterSuccessfull = await userTable.create({
      userName: username,
      email: email,
      Password: hashedPassword,
    });

    if (ResgisterSuccessfull) {
      const template = await tamplateTable.findByPk(3);
      const htmlTemplate = Handlebars.compile(template.content);
      const data = htmlTemplate({ name: username });
      sendMail(email, username, data);  
      await otpTable.destroy({ where: { otp: otp } });                       //confirmation mail to the user
      return res.json(successResponse("User registered successfully",{}));
 
    }
  } catch (error) {
   return res.json(errorResponse(error,{}));
  }
};


//method for sending OTP to the user email
const validateUser = async (req, res) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  try {

    const { username, email, password } = req.body;
    const data = {
      username,
      email,
      password,
    };

    const rules = {
      username: "required|string|between:2,20",
      email: "required|email|isUnique:users,email",  
      password: "required|between:6,30",
    };

     const validationResponse = await validate(data, rules);
    
    if (validationResponse.status === 0) {
     return res.json(errorResponse(validationResponse.message,{}))
    }
    const rawHtmlTemplate = await tamplateTable.findByPk(3);
    const mainHtmlTemplate = Handlebars.compile(rawHtmlTemplate.content);
    const insertValInTemp = mainHtmlTemplate({ otp });
   const isRecordExist = await otpTable.findOne({where:{email:email}})
     if(isRecordExist){
        await otpTable.update({email:email, otp:otp}, {where:{email:email}})
    }
    else{
      await otpTable.create({ email:email, otp:otp });
    }      
    await confirmationMail(email, insertValInTemp);  //sending mail 
    return res.json(successResponse("Otp has been sent in your email address", {}))



  } catch (error) {
    console.error("Error occurred during user validation:", error);
    return res.json(serverErrorResponse("Error occured during registration", error, {}))
  }
};

module.exports = {Regiteruser,validateUser};