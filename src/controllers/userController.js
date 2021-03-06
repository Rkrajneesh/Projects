const mongoose = require("mongoose")
const userModel = require("../models/userModel.js")
const jwt =  require("jsonwebtoken")
const validation = require("../middleware/validation")



const registerUser= async (req,res)=>{
    try{ let data = req.body;
        if(Object.keys(data)==0){
            return res.status(400).send({status:false, msg:"No input"})}
            const {title,name,phone,email,password}=data;
            if(!validation.valid(title)){ return res.status(400).send({ status:false,msg:"imput title"})}
            if(!validation.valid(name)){ return res.status(400).send({ status:false,msg:"input name"})}
            if(!validation.valid(phone)){ return res.status(400).send({ status:false,msg:"input phone"})}
            if(!validation.valid(email)){ return res.status(400).send({ status:false,msg:"input email"})}
            if(!validation.valid(password)){ return res.status(400).send({ status:false,msg:"input password"})}

            const emailExt = await userModel.findOne({email :data.email})
            if(emailExt){ return res.status(400).send({msg :"already exist email"})}

            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
              return res.status(404).send({ status: false, message: "Enter  valid email address " });}

              if (!/^(\()?\d{3}(\))?(|\s)?\d{3}(|\s)\d{4}$/.test(phone)) {
              return res.status(404).send({ status: false, message: "Enter  valid mobile number " });}

            const phoneExt = await userModel.findOne({phone:data.phone})
            if(phoneExt) {return res.status(400).send({msg:"phone exist"})}

            if(password.length<5 ||password.length>15){return res.status(400).send({msg:"Password minimum length is 5 and maximum length is 15"})}
           // if(password.length>15){return res.status(400).send({msg:"Enter less than 5 character"})}
            
           let saveData = await userModel.create(data);
            return res.status(201).send({status:true,msg:saveData})
            }
    catch(error){ 
        console.log(error)
        return res.status(500).send({status:false,msg:error});
    }
}


const loginUser= async (req,res)=>{
    try{ Data = req.body
       
        if(Object.keys(Data)==0){ return res.status(400).send({status:false,msg:"Please provide the input"})}
        const {email,password}=Data;


        if(!validation.valid(email)){ return res.status(400).send({status:false,msg:"Insert email"})}
        if(!validation.valid(password)){ return res.status(400).send({status:false,msg:"Insert Password"})}

        const findUser = await userModel.findOne({email:email,password:password})

        if(Object.keys(findUser)==0){ return res.status(404).send({status:false,msg:"No user found"})}

         const token = jwt.sign({ 
            userId: findUser._id,
            
          }, "Project-Three", { expiresIn: "24h" }
        
        );
       // let decodedtoken = jwt.verify(token, "Project-Three")
        //console.log(decodedtoken.userId)
        return res.status(200).send({status:true,msg:"Successful Login",token})
    }
    catch(err){
        console.log(err)
        return res.status.send({status:false,msg:err})
    }
}



module.exports.loginUser = loginUser
module.exports.registerUser = registerUser