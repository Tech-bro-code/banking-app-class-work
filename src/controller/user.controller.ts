import { Request, Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IPreRegister } from "../interface/user.register";
import { userService } from "../service/user.service";

export class UserController {
    static preSignup= asyncWrapper(async(req:Request, res:Response)=>{
        const data = req.body as IPreRegister;
        // console.log(data)
        const response = await userService.preRegister(data)
        res.status(201).json({
            success:true,
            payload:response
        })
    });

    static register = asyncWrapper(async(req:Request, res:Response)=>{
        req.body.email=req.body.email.toLowerCase()
        const user = req.body
        const response = await userService.register(user)
        res.status(200).json({
            status:"success",
            payload:response
        })
    });

    static login = asyncWrapper(async(req:Request, res:Response)=>{
        req.body.email=req.body.email.toLowerCase()
        const {email, password} = req.body;
        const ipAddress = req.ip as string;
        const userAgent = req.headers["user-agent"] as string;
        const response = await userService.login({email, password, ipAddress, userAgent});
        res.status(200).json(response)
    }

    );

    static fetchProfile = asyncWrapper(async(req:Request,res:Response)=>{
        req.body.email=req.body.email.toLowerCase()
        const {email} = req.body
        const response = await userService.fetchProfile(email)
        res.status(201).json(response)
    }

    );

    static updateProfile = asyncWrapper(async(req:Request, res:Response)=>{
        let {id} = req.params;
        const {update} = req.body;
        try {
              const response = await userService.updateProfile(id, update)
        res.status(201).json(response)
        } catch (error:any) {
            res.status(403).json(error.message)
            
        }
      
    }

    )

    static updateProf = asyncWrapper(async(req:Request, res:Response)=>{
        const {email, update} = req.body
        const response = await userService.updateProf(email,update)
        res.status(201).json(response)

    }

    )

    static transfer = asyncWrapper(async(req:Request, res:Response)=>{
        const {accountNumber,update} = req.body;
        const response = await userService.transfer(accountNumber,update)
        res.status(200).json(response)
    }
    

    );

    static getBalance = asyncWrapper(async(req:Request, res:Response)=>{
        const {accountNumber} = req.body;
        const response = await userService.getBalance(accountNumber)
        res.status(201).json(response)
    }
    
    )

    static forgotPassword = asyncWrapper(async(req:Request,res:Response)=>{
        req.body.email=req.body.email.toLowerCase()
        const {email}= req.body;
        const response = await userService.forgotPassword(email)
        res.status(201).json(response)
    }

    );

    static validateOtp = asyncWrapper(async(req:Request, res:Response)=>{
        req.body.email=req.body.email.toLowerCase()
        const {email,otp} = req.body;
        const response = await userService.validateOtp(email,otp)
        res.status(201).json({
            success:"true",
            payload:response
        })
    }

   

    )
    static updatedPassword = asyncWrapper(async(req:Request, res:Response)=>{
        req.body.email=req.body.email.toLowerCase();
        const {email,otp, password,confirm} = req.body;
        const response = await userService.updatePassword({email,otp,password,confirm})
        res.status(201).json({
            message:"Success",
            payload:response
        })
    }

    )
}
