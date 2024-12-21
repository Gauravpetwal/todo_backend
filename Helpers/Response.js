//for error response
const errorResponse = (message,data) =>{
    return{
        status:400,
        message:message,
        data:data
    }

}

//for error response if the error from serverside
const serverErrorResponse = (message, data)=>{
    return{
        status:500,
        message:message,
        data:data
    }
}

//for success response
const successResponse = (message,data) =>{
    return{
        status:201,
        message:message,
        data:data
    }

}

//other type response
const failed =(res,message,data)=>{
    return res.status(400).json({message:message, data:data})
}

//for temprary success
const success = (res,message,data)=>{
    return res.status(201).json({message:message, data:data})
}

module.exports = {errorResponse,successResponse,serverErrorResponse,failed,success}