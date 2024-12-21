const express = require('express')
const router = express.Router();
const authentication = require('../middlwares/Usermiddlware/authmiddlware')
const {upload,validateImageDimensions} = require('../middlwares/Usermiddlware/uploadMiddle')
const userDetail = require("../controllers/UserController/userDetails")
const login = require('../controllers/UserController/loginUser')
const {Regiteruser,validateUser} = require('../controllers/UserController/Regiteruser')
const limiter = require('../middlwares/rateLimiting')
const todo = require("../controllers/UserController/userToDo")
const password = require('../controllers/UserController/ForgetPass')
const image = require('../controllers/UserController/imageContrl')







//signup route
router.post('/Signup',Regiteruser );
router.post('/validate', validateUser);

//signIn route
router.post('/login',limiter,login);


//Add todo route
router.post('/todos/', authentication,todo.AddToDo)


//gettodo route
router.get('/gettodos', authentication, todo.getTodo)

//copleted route
router.get('/completedTods',authentication,todo.completedTodos)

//delete route
router.delete('/deleteToDo/:id', authentication,todo.deletetoDo)

//update route
router.put('/updateToDo/:id', authentication, todo.updateTodo)

//update staus the of todo
router.put("/updateStatus/:id", authentication,todo.updateStatus)

//forget password route
router.post('/forgetPassword', password.ForgetPassword)
router.put('/resetpassword', password.reset)



//route for user detail
router.get("/userDetail",authentication,userDetail)


//router for upload image
router.post('/uploadImage', authentication, upload.single('image'),validateImageDimensions, image.uploadUserImage);

//router for get image
router.get('/userImage',authentication, image.getUserImage)




module.exports = router