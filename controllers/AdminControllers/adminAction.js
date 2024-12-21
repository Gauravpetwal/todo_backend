const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const ToDotable = require('../../models/toDo');
const userTable = require('../../models/users');
const errorResponce = require('../Responce_Mthod/ErrorMethod')
const successrResponce = require('../Responce_Mthod/SuccessMethod')
const response = require('../../Helpers/Response')

//function for retrive all user
const allUser = async (req,res) =>{
      
    try{
        const allUser  = await userTable.findAll({where:{role:{[Op.ne]:'admin'}}});
        if (allUser.length === 0) {
            return response.failed(res,"NO user found")
          }
          return response.success(res,null,allUser);
         

    }catch (error) {
        console.error("Error occurred while fetching todos:", error);
      return response.failed(res,"Error while fetching todos.",null)
        
    }
}

//function for delete a user
const deleteUser = async (req,res)=>{
    const {id} = req.params
    try{
        
        if(!id){
            return errorResponce(res,404,"User not found")
        }
        const userDeletion =  await userTable.destroy({where:{id:id}});        
        return response.success(res,"Deleted successfully",null)  

    }catch(error){
        console.log(error);
        
        return response.failed(res,"Error while deleting user," , error)   
    }

}

//function for add a user
const addNewUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {       
      
        const findusr = await userTable.findOne({where:{email:email}})
        if(findusr){
            return response.failed(res,"User already registed with this email",null);
           
        }        
        if (!username || !email || !password) {
            return response.failed(res,"input valuse are required",null)
           ;
        }

        const hashedPassword = await bcrypt.hash(password, 10); 
        if(!findusr){
        await userTable.create({ userName: username, email: email, Password: hashedPassword })
                
        return response.success(res,201,"User add successfully")
    }
    } catch (error) {

        console.error("Failed to add user:", error);
        return response.failed(res,"An error occurred during add new user")
    }
};

//function for update user credential
const updateUser = async (req, res) => {
    const { email, userName } = req.body;
    const { id } = req.params;

    try {
        if (!email || !userName) {
            return response.failed(res, "Provide the user credentials");
        }

        const user = await userTable.findOne({ where: { id: id } });
        if (!user) {
            return response.failed(res,"User not found");
        }

        const [updated] = await userTable.update(
            { userName: userName, email: email },
            { where: { id: id } }
        );

        if (updated) {
            const updatedUser = await userTable.findByPk(id);
            return response.success(res,null,updatedUser);
        } else {
            return response.failed(res,"Update failed",null);
        }
    } catch (error) {
        console.error(error);
        return errorResponce(res, 500, "Internal server error");
    }
};

//showing all todos
// const allToDos = async ()=>{

// }


module.exports ={allUser,deleteUser,addNewUser,updateUser}
