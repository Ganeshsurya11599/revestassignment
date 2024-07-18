const express=require('express');
 const logincontrollers=require('./logincontroller');

 var loginRouting=express.Router();

 loginRouting.route('/allusers').get(logincontrollers.getUsers);
 loginRouting.route('/login').post(logincontrollers.login);
 loginRouting.route('/createuser').post(logincontrollers.createUser);
 loginRouting.route('/updateactive').post(logincontrollers.activeStatus);


module.exports=loginRouting;