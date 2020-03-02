

var express = require('express');
var router = express.Router();

const commonController=require('../controller/commonController');

/* GET home page. */
//router.get('/', function(req, res, next) {
 // res.render('index.html');
//});
// router.get('/',commonController.admin);

// router.post('/register',commonController.adminRegister);

// router.post('/login',commonController.adminLogin);



/* GET Route */
router.get('/',commonController.checkauth,function(req,res){
  res.render('login.html');
});



 router.get('/adduser',commonController.checkauth,function(req,res){
  
  res.render('userregister.html');
 });

 router.get('/addsubadmin',commonController.checkauth,function(req,res){
  
  res.render('subadminregister.html');
});
//router.post('/register',commonController.register);
router.post('/registeruser',commonController.checkauth,commonController.registeruser);

 router.post('/registersubadmin',commonController.checkauth,commonController.registersubadmin);

router.post('/login',commonController.login);


//
router.get('/userview',commonController.checkauth,commonController.userview);
 
router.get('/subadminview',commonController.checkauth,commonController.subadminview);

router.get('/modify/:id',commonController.checkauth,commonController.checkType,commonController.mod)

router.post('/update',commonController.checkauth,commonController.checkType,commonController.modify);

router.get('/delete/:id',commonController.checkauth,commonController.checkType,commonController.del)

router.get('/logout',(req,res)=>{
  res.clearCookie('name').redirect('/');
})



module.exports = router;





