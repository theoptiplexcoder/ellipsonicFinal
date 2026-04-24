const express = require("express");
const router = express.Router();
const {registerController,loginController} = require("../controller/authController");
const validate=require("../middleware/validateMiddleware");
const {registerSchema,loginSchema} = require("../validators/authValidator");

router.get("/",(req,res)=>{
    res.status(200).send("Hello world");
})

router.post("/register",validate(registerSchema),registerController)
router.post("/login",validate(loginSchema),loginController)

module.exports = router;