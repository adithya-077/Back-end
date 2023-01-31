const jwt = require("jsonwebtoken");
const { model } = require("mongoose");

const auth = async (req, res , next) =>{
    try{
        const token = req.header("x-auth-token");
        if(!token)
        {
            return res.status(401).json({msg:"No authentication token  , access denied."});

        }
        const verified_token = jwt.verify(token , "passwordkey");
        if(!verified_token){
            return res.status(401).json({msg:"Token verification failed , access denied."});
        }
        req.user = verified_token.id;
        req.token = token;
        next();
        }
    catch(e){
        res.status(500).json({error:e.message});
    }

}

module.exports = auth;