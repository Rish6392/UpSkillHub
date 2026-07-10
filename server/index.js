const express = require ("express");
const app=express();

const userRoutes = require("./routes/User")
const profileRoutes= require("./routes/Profile")
const paymentRoutes = require("./routes/Payments")
const courseRoutes = require("./routes/Course")
const contactUsRoutes = require("./routes/ContactUs")

const db = require("./config/database")
const cookieParser = require('cookie-parser');
const cors = require("cors"); // backend-frontent connect
const {cloudinaryConnect} = require("./config/cloudinary")
require('dotenv').config();
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "https://up-skill-hub-gamma.vercel.app","http://127.0.0.1:5173"],
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp'
}));

db.connect();


cloudinaryConnect();

//routes mount
app.use("/api/v1/auth",userRoutes)
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/course",courseRoutes)
app.use("/api/v1/payment",paymentRoutes)
app.use("/api/v1/contact",contactUsRoutes);


// Redirect route for password reset (so email links use trusted onrender.com domain)
app.get("/reset-password/:token", (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/update-password/${req.params.token}`);
})

//default route
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running....."
    })
})

app.listen(port,()=>{
    console.log(`Example app is listening on port ${port}`);
})