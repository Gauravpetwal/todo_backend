const userTable = require("../../models/users");
const otpTable = require("../../models/otp");
const bcrypt = require('bcrypt');
const RestPassword = require("../EmailController/ResetPassEmail")
const tamplateTable = require("../../models/tamplate")
const Handlebars = require('handlebars');
const validate = require("../../Helpers/Validator");
const response = require('../../Helpers/Response')


const ForgetPassword = async (req, res) => {
  const {Email}=req.body
   const otp = Math.floor(1000 + Math.random() * 9000);
    try {
      const data = {
        Email:Email
      }
      const rules ={
        Email:'required|email|isExist:users,email'
      }
     const validationResponse = await validate(data,rules)
   
     if(validationResponse.status === 0){
        return response.failed(res,validationResponse.message, null)
     }
    const isMatch = await userTable.findOne({ where: { email: Email } });   
    if (isMatch) {
      await otpTable.create({ email: Email, otp: otp });
      const template = await tamplateTable.findByPk(1)
      const htmlTemplate = Handlebars.compile(template.content);
      const htmlData = htmlTemplate({"otp":otp})      
      RestPassword(Email,htmlData)    
    return response.success(res,"match found",null);
    }
    return response.failed(res,"Error while finding user",null);
  } catch(error) {
    return response.failed(res,error,null)
  }
};


const reset = async (req,res)=>{
  const {otp,newPass}=req.body
  try{
    const data={
      Otp:otp,
      Password:newPass
    }
    const rules ={
      Otp:"required|integer",
      Password:"required|between:6,30"
    }

    let validationResponse = await validate(data,rules) 
   
    if(validationResponse.status === 0 ){
      return response.failed(res,validationResponse.message,null)
    }

  const userotp = await otpTable.findOne({where:{otp:otp}})  
  if(!userotp){
    return response.failed(res,"Wrong OTP",null)
  }
  const hashedPassword = await bcrypt.hash(newPass, 10);
  const userEmail = userotp.email;
  const resetPass = await userTable.update({Password:hashedPassword},{where:{email:userEmail}})
  if(resetPass){
    await otpTable.destroy({where:{otp:otp}})
    return response.success(res,"Password has been reset",null)

  }
}catch(err){
    return response.failed(res,"Error while reseting password",null)
}

}

module.exports ={ ForgetPassword,reset};
