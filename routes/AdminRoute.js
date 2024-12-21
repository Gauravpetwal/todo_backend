const express = require('express')
const router = express.Router();
const {AdminAuthentication,validateAdminCredential,userCredentialValidation,validateDeletion} = require('../middlwares/AdminMiddlware/AdminAuth')
const Signin = require('../controllers/AdminControllers/Signin');
const { json } = require('sequelize');
const alluser = require('../controllers/AdminControllers/adminAction').allUser
const deleteuser = require('../controllers/AdminControllers/adminAction').deleteUser
const addUser = require('../controllers/AdminControllers/adminAction').addNewUser
const updateUser = require('../controllers/AdminControllers/adminAction').updateUser



//Admin signin route
router.post('/Admin/signin',Signin)


//admin getting all users
router.get('/allUser',AdminAuthentication,alluser)

// //admin deletin a uers
router.delete('/deleteUser/:id',AdminAuthentication,validateDeletion, deleteuser)



//Admin adding new user
router.post("/adduser",AdminAuthentication,userCredentialValidation,addUser)


//Admin udatetin user credential
router.put("/upDate/:id",updateUser)

module.exports = router;
