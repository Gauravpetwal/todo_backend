//method for success response

const successResponse = (res,statusCode,message) =>{
    return res.status(statusCode).json({message:message})

    // ( message , data = [])
    // retrurn    {
    //     status :4=55,
    //     message:"message",
    //     data :data
    // }
}

module.exports = successResponse;