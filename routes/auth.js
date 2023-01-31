const express = require('express');
const User = require('../model/usermodel');
const authRouter = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth_middleware');
const e = require('express');

authRouter.post("/signup", async (req , res )=>{
    try{
        const {Fname , Lname , mobileno ,  email , password , dob } = req.body;
        const existinguser = await User.findOne({email});
        console.log(existinguser )
        if(existinguser){
            return res.status(400).json({msg:"User with same email exists"}); 
        } 
        
        const hashedpassword = await bcryptjs.hash(password , 8);
        let user = new User({

            email,
            password : hashedpassword , 
            Fname,
            Lname,
            mobileno,
            dob, 
        })
        user = await user.save();
        res.json({user});
    }
    catch(e)
    {
         res.status(500).json({error : e.message});
    }
});

authRouter.post("/signin", async (req , res )=>{
try{
    
    const {email , password} = req.body;
    const existinguser = await User.findOne({email});
    if(!existinguser){
        return res.status(400).json({msg:'User with the email does not exist'});
    }
    const isMatch = await bcryptjs.compare(password , existinguser.password);
    if(!isMatch){
        return res.status(400).json({msg:'Incorrect Password'});
    }
     const token = jwt.sign({id : existinguser._id},"passwordkey");
     res.json({token,...existinguser._doc});
     console.log(tok);
}   
catch(e){
    res.status(500).json({error:e.message});
}
});

module.exports = authRouter;
