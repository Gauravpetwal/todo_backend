const errorResponce = (res,statuscode,message) =>{
return res.status(statuscode).json({message:message});
}

module.exports=errorResponce;