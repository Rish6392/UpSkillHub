const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


//auth
exports.auth = async(req,res,next)=>{
    try {
        // extract token
        let token = null;
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } else if (req.body && req.body.token) {
            token = req.body.token;
        } else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // if token missing, then return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (error) {
            // verification issue
            console.log(error.message);
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        });
    }
}

// isStudent
exports.isStudent = async(req,res,next)=>{
    try{
      // ek tarika accountType ko req.user se chek karlo
      if(req.user.accountType !=="Student"){
        return res.status(401).json({
            success:false,
            message:"this is a protected route for Student only"
        })
      }
      next();

    }
    catch(error){
       return res.status(500).json({
           success:false,
           message:"User role canot be verified,please try again"
       })
    }
}

// isInstructor
exports.isInstructor = async(req,res,next)=>{
    try{
      // ek tarika accountType ko req.user se chek karlo
      if(req.user.accountType !=="Instructor"){
        return res.status(401).json({
            success:false,
            message:"this is a protected route for Instructor only"
        })
      }
      next();

    }
    catch(error){
       return res.status(500).json({
           success:false,
           message:"User role canot be verified,please try again"
       })
    }
}

// isAdmin
exports.isAdmin = async(req,res,next)=>{
    try{
      // ek tarika accountType ko req.user se chek karlo
      if(req.user.accountType !=="Admin"){
        return res.status(401).json({
            success:false,
            message:"this is a protected route for Admin only"
        })
      }
      next();

    }
    catch(error){
       return res.status(500).json({
           success:false,
           message:"User role canot be verified,please try again"
       })
    }
}

