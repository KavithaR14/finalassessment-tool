const express = require("express");
const { 
  sendOtp, 
  verifyOtp, 
 
  // sendAssessmentReport 
} = require("../Controllers/userController");

const router = express.Router();

// Auth routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);


// Assessment report route
// router.post("/send-assessment-report", sendAssessmentReport);

module.exports = router;