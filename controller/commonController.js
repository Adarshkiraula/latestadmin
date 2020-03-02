const model = require('../model/user');
const key =require('../key');
const jwt =require('jsonwebtoken');
const nodemailer = require("nodemailer");
var generator = require('generate-password');

//const sha1 = require('sha1');
var msg = "";
var object_id;


 module.exports = {
     login,registeruser,registersubadmin,checkauth,userview,subadminview,del,mod,modify,checkType
     //register,
 }
 let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'munjal.chirag.test@gmail.com',
        pass: '7500598665'
    }
});
function eMail(email, password, req, res) {


    let mailOptions = {
        from: 'munjal.chirag.test@gmail.com',
        to: 'abc@gmail.com',
        subject: "Registration",
        html: "Thanking You For Registering Your Email: " + email + "  Password: " + password
    };

    transporter.sendMail(mailOptions, function (error, info) {

        if (error) {
            console.log(error);

        } else {
            console.log('Email sent: ' + info.response);

        }

    });


}


// function register(req, res) {
//     let name=req.body.name;
//     let age=req.body.age;
//     let email = req.body.email;
//     let password = req.body.password;
//     console.log(name);
//     console.log(age);
//     console.log(email);
//     console.log(password);
    
//     let udata = new model({'name':name,'age':age, 'email': email, 'password': password })

//     udata.save(function (err,data) {
//         if (err) {
//              msg = err
//             // res.render('register.html');
//             console.log(err);
//             res.render('register.html',{msg});
//         }
//         else {
//              msg = "Registered Succesfully"
//               res.render('login.html');
//             // res.json("Registered");
//             console.log(data);
//         }
//     })

// }

function login(req,res)
{
    let email = req.body.email;
    var pass = req.body.pass;
   
    console.log(email);
    console.log(pass);
    model.findOne({ email: email }, function (err, data) {

        console.log(data);
        if (err) {

            console.log(err);
        }

        else if (data == null) {
            res.send("User Not Found")

        }
        else {
            // test a matching password
            data.comparePassword(pass, function (err, isMatch) {
                if (err) throw err;
                console.log("Password Verified", isMatch);
                //res.render('index.html'); // -&gt; Password123: true
                if (isMatch) {
                    console.log(data)
                    object_id=data.id;
                    role=data.role;
                    if(role=='admin'){
                        console.log(object_id);
                        let token=generateToken(object_id);
                        console.log("Received Token",token);
                        res.cookie('name',token).render('index.html');
                    }
                    else if(role=='subadmin'){
                        res.json("subadmin");
                    }
                    else{
                        res.json('user');
                    }
                }

                else {

                    res.send("Wrong Password")
                }
            });


        }
    });



}
  


function registersubadmin(req,res)
{
    let name=req.body.name;
    let age=req.body.age;
    let email = req.body.email;
    let password = generator.generate({length:10
    });
    console.log(name);
    console.log(age);
    console.log(email);
    console.log(password);
    
    let udata = new model({'name':name,'age':age, 'email': email, 'password': password,'role':'subadmin' })

    udata.save(function (err,data) {
        if (err) {
             msg = err
            // res.render('register.html');
            console.log(err);
            res.render('subadminregister.html',{msg});
        }
        else {
             msg = "Registered Succesfully"
            //token
            console.log(data)
            object_id=data.id;
             console.log(object_id);
             let token=generateToken(object_id);
             console.log("Received Token",token);
             res.cookie('name',token);
            //
             eMail(email,password);
            // console.log(data);
            res.render('index.html');
        }
    })
}
function registeruser(req, res) {
    let name=req.body.name;
    let age=req.body.age;
    let email = req.body.email;
    let password = generator.generate({length:10
    });
    console.log(name);
    console.log(age);
    console.log(email);
    console.log(password);
    
    let udata = new model({'name':name,'age':age, 'email': email, 'password': password,'role':'user' })

    udata.save(function (err,data) {
        if (err) {
             msg = err
            // res.render('register.html');
            console.log(err);
            res.render('userregister.html',{msg});
        }
        else {
             msg = "Registered Succesfully"
             console.log(data)
             object_id=data.id;
             console.log(object_id);
             let token=generateToken(object_id);
             console.log("Received Token",token);
             res.cookie('name',token);
              
            // res.json("Registered");
           // console.log(data);
           eMail(email,password);
            res.render('index.html');
        }
    })

}
function generateToken(value)
{
    console.log("Generate Id received" +value)
    let token=jwt.sign({'id':value},key.secret,{expiresIn: '5m'});
    return token;
}
function checkauth(req,res,next)
{
    let token=req.cookies.name;
    console.log("Cookie"+token);
    jwt.verify(token,key.secret,function(err)
{
    if(err)
    {
        console.log(err);
        res.render('login.html');
    }
    else{
        next();
    }
})
}
function userview(req, res) {
    
        model.find({ 'role': 'user'}, function (err, data) {
            juser = data
            res.render('userview.html', { juser });
        })
    
    }
function subadminview(req, res) {
    
        model.find({ 'role': 'subadmin'}, function (err, data) {
            juser = data
            res.render('subadminview.html', { juser });
        })
    
    }
    function mod(req,res){
        let id = req.params.id;
        console.log("*******"+id);
        model.findOne({'_id':id},(err,data)=>{
            if(err){
                console.log(err)
            }
            else{
                
                let name=data.name;
                let age=data.age;
                let email=data.email;
                let role=data.role;
                let id=data.id;
                let is_deleted=data.is_deleted;
                res.render('modify.html',{name,age,email,role,id,is_deleted});
            }
        })
    }
    function modify(req,res){
        let name=req.body.name;
        let age=req.body.age;
        let role=req.body.role;
        let id=req.body.id;
        let is_deleted=req.body.is_deleted;
        console.log(is_deleted)
       model.findByIdAndUpdate({'_id':id},{$set:{'name':name,'age':age,'role':role,'is_deleted':is_deleted}},(err,data)=>{
         if(err){
             console.log(err)
    
         }  
         else{
             if(role=='subadmin'){
              res.redirect('/subadminview');}
              else{
                   res.redirect('/userview');
              }
         }
       })
    
    
    }
    function del(req,res)
    {
        let id = req.params.id;
        console.log("#############"+id);
        model.findOneAndUpdate({ '_id': id }, { $set: { 'is_deleted': 'true' } }, (err, data) => {
            if (err) {
                res.json("err")
            }
            else {
                role = data.role;
                
                if (role == 'user') {
                    res.redirect('/userview');
                }
                else {
                    res.redirect('/subadminview');
                }
            }
        })
    
    }


    function checkType(req, res, next) {
        let type = req.type;
        if (type == 'admin') {
            next();
        }
        else {
            msg = "Only Admin Is Authorized"
             res.redirect('/');
        }
    
    }
