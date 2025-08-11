const express = require("express");
const router = express.Router();
const { auth,isStudent, isInstructor } = require("../middlewares/auth");

const {capturePayment,verifySignature,
    enrolledStudents,sendPaymentSuccessEmail} 
    = require("../controllers/Payments");

//
router.post('/capturePayment',auth,isStudent,capturePayment)
router.post('/verifyPayment',auth,isStudent,verifySignature)


router.post('/sendPaymentSuccessEmail',auth,isStudent,sendPaymentSuccessEmail)


module.exports = router