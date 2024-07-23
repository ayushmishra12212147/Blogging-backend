const express=require('express');
const usersController=require('../controllers/userController')
const verifyJWT=require('../middleware/verifyJWT')
const router=express();



//register api
router.post('/users/login',usersController.userlogin)


//login api
router.post('/users',usersController.registeruser)


//get Current User
router.get('/user',verifyJWT,usersController.getCurrentUser)


//update User
router.put('/user',verifyJWT,usersController.updateUser)




module.exports= router;
