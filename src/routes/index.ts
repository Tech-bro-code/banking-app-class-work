import express from "express";
import { UserController } from "../controller/user.controller";
import { loginSchema, preRegisterSchema, registerSchema } from "../validation/user-schema";
import { validator } from "../middleware/validator.middleware";



const router = express.Router();

router.post("/pre-register",validator(preRegisterSchema) as any,UserController.preSignup)
router.post("/register", validator(registerSchema)as any, UserController.register)
router.post("/login", UserController.login)
router.post("/forgot-password", UserController.forgotPassword)
router.post("/verify-otp", UserController.validateOtp)
router.put("/update-password", UserController.updatedPassword)
router.patch("/update-password1", UserController.updatedPassword)
router.get("/get-profile", UserController.fetchProfile)
router.put("/update", UserController.updateProf)
router.put("/update-user/:id", UserController.updateProfile)
router.get("/fetch-balance", UserController.getBalance)
router.put("/transfer", UserController.transfer)

export default  router;