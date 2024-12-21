const Validator = require('validatorjs');
const models = require('../config/db')
 
//for signup validation
Validator.registerAsync('isUnique', async (value, attribute, req, passes) => {
    try {
        const tableName = attribute.split(",")[0];    
        const columnName = attribute.split(",")[1]; 
        const columnValue = value;
        console.log(tableName,columnName,columnValue)
        const [result] =  await models.query(`SELECT *FROM ${tableName} WHERE ${columnName} = "${columnValue}"`)
        if (result.length === 1) {
            passes(false, ` ${req} is already exist`);
        } else {
            passes();
        }
    } catch (error) {
        passes(false, 'An error occurred while checking the email.');
    }
});

//for login or signin validation
Validator.registerAsync("isExist", async (value,attribute,req, passes) =>{   
    try{
        const tableName = attribute.split(",")[0];    
        const columnName = attribute.split(",")[1]; 
        const columnValue = value;
       const [result] =  await models.query(`SELECT *FROM ${tableName} WHERE ${columnName} = "${columnValue}"`)
        if(result.length === 0){
            passes(false,` ${req} is not Exist`)
        }
        else{
            passes()
        }
    }catch(error){
        passes(false,"An error occured while verifying email")
    }

})


// Function to get the first error message
const firstError = (validation) => {
    const firstKey = Object.keys(validation.errors.errors)[0];
    return validation.errors.first(firstKey);
};

// Main validation function
async function validate(request, rules, messages = {}) {
    if (typeof request !== 'object' || typeof rules !== 'object' || typeof messages !== 'object') {
        return {
            status: 0,
            message: 'Invalid Params'
        };
    }

    const validation = new Validator(request, rules, messages);
 
    return new Promise((resolve) => {
        validation.checkAsync(
            () => resolve({ status: 1, message: "done" }),
            () => resolve({ status: 0, message: firstError(validation)}) // Resolve with error message
        );
    });
}

module.exports = validate;
