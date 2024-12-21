const userTable = require("../../models/users")
const {errorResponse,successResponse} = require('../../Helpers/Response')
const validate = require('../../Helpers/Validator')

const userDetail = async (req, res) => {
  const id = req.user.id;
  try {
    const validation = await validate({id},{id:'required|integer'})
      if(validation.status === 0){
      return res.json(errorResponse(validation.message, null))
    } 
    const user= await userTable.findByPk(id, {
      attributes: { exclude: ['Password'] } 
  })
    if(!user){
        return res.json(errorResponse("User not found")  )
    }
   
    return res.json(successResponse(null,user))
 

  } catch (error) {
     return res.json(errorResponse(error,null))
  
  }
};

module.exports = userDetail;