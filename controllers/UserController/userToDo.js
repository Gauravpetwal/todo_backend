const Validator = require('validatorjs');
const express = require('express');
const ToDotable = require('../../models/toDo');
const {errorResponse,successResponse,serverErrorResponse} = require('../../Helpers/Response')
const {Op} = require('sequelize')
const validate = require('../../Helpers/Validator')


//todo related funtion
const AddToDo = async (req, res) => {
    const { ToDo } = req.body; 
    const UserId = req.user.id;
    try {
        const data = {
            todo: ToDo,
            id: UserId,
          };
          const rules = {
            todo: "required|string|between:5,300",
            id: "required|integer|min:1",
          };
        
          const validation = await validate (data, rules);
          if(validation.status === 0){
            return res.json(errorResponse(validation.messages))
          }

        if(validation.status === 1){
            const newTodo = await ToDotable.create({ ToDoName: ToDo, UserId: UserId })
            return res.json(successResponse("Todo added successfully", newTodo))
        }

    } 
    catch (error) {       
        return res.json(errorResponse("Error while adding todo.", error));
    }
};


//fetch all todos
const getTodo = async (req, res) => {
    const userId = req.user.id;
    try {
        const rules={
            userId:'required|integer'
        }
        const validation = await validate ({userId}, rules);
        console.log("validation response", validation)
      if(validation.status === 0){
        return res.json(errorResponse(validation.message,null))
      }
      if(validation.status === 1){
        const userTodos = await ToDotable.findAll({ where:{userId:userId} , order: [['createdAt', 'DESC']] });
         return res.json(successResponse(null,userTodos))
      }  
       
    } catch (error) {
      return res.json(serverErrorResponse("Error while fetching todos.", error))
        
    }
};

//update the status of todo
const updateStatus = async(req,res)=>{
    const {id} = req.params
     try{
        const rules ={
            id:'required|integer'
        }

      const validation = await validate ({id}, rules);
      if(validation.status === 0){
        return res.json(errorResponse(validation.message,null))
      }
      if(validation.status===1){
        const changeStatus = await ToDotable.update({status:"completed"}, {where:{id:id}})
        if(changeStatus){
              const updatedTodo = await ToDotable.findByPk(id)
              return res.json(successResponse(null, updatedTodo))
          }
    }
        
    }
    catch(error){
        return res.json(errorResponse("error while",error))
    }


}

//function for fetch only completed todos
const completedTodos = async(req,res) =>{
    const userId = req.user.id;
    try{
        const todos = await ToDotable.findAll({where:{[Op.and]:[{userId:userId},{status:compeled}]}})
        if(todos.length === 0){
           return errorResponce(res,404,"Sorry you didn't have completed todos")
        } 
        return res.status(201).json(todos)
        
    }catch(error){
        console.log(error)
        return errorResponce(res,500,"Server error refresh the page")
    }
}



//for deleting a todo
const deletetoDo = async (req, res) => {
    try {    
    const {id} = req.params
          const rules = {
            id: "required|integer|min:1",
          };          
          const validation = await  validate({id}, rules);

          if(validation.status === 0){          
            return res.json(errorResponse(validation.message,null))
          }
          if(validation.status === 1){
                const deleteTodo = await ToDotable.destroy({ where: { id: id } });
            if(!deleteTodo){
                return res.json(errorResponse("Todo not deleted",null))
            }
            return res.json(successResponse("Deleted successfully", null))
          }              
    } catch (error) {
        return res.json(errorResponce("Error while deleting todo") )  
    }
};

//for update or edit a todo
const updateTodo = async (req, res) => {    
    try {
    const{ id } = req.params;
    const {ToDoName} = req.body;
   
        const data = {
            Id: id,
            Todo:ToDoName,
          };
           const rules = {
            Id: "required|integer",
            Todo: "required|string|between:5,300",
          };
          const validation = await validate(data, rules);
          if(validation.status === 0){
            return res.json(errorResponse(validation.message,null))
          }

          if(validation.status === 1 ){
            const [updated]= await ToDotable.update(
                { ToDoName:ToDoName },
                { where: { id: id } }
               
            );
            console.log("value has benn updata rows number",updated)

          if(updated){
            const updatedTodo = await ToDotable.findByPk(id);  
            return res.json(successResponse("Todo updated successfully", updatedTodo))    
          }
          return res.json(errorResponse("can't update the todo",null))

          }

    } catch (error) {
        return res.json(errorResponse(error,null))
       
    }
};

module.exports = { AddToDo, getTodo, deletetoDo, updateTodo, completedTodos,updateStatus};
