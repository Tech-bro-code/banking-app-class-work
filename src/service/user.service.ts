import * as crypto from "crypto"
import { UserRepository } from "../repository/user.repository"
import { IPreRegister, IRegister } from "../interface/user.register"
import bcrypt from "bcrypt"
import { walletRepository } from "../repository/wallet.repository";
import { newError } from "../middleware/errorHandler.midleware";
import { sendMail } from "../utils/nodemailer";
import { loginTemplate, otpTemplate } from "../utils/otp-template";
import jwt, { NotBeforeError } from "jsonwebtoken"
import { walletModel } from "../models/wallet.models";
import { IAddWallet } from "../@types/wallets";
import { otpModel } from "../models/otp.models";
import { transactionModels } from "../models/transsaction.models";
import { error } from "console";
import { Types } from "mongoose";
import { response } from "express";
import { userModel } from "../models/user.model";
import { fgtPwdSchema, loginSchema, resetPwdSchema } from "../validation/user-schema";


const jwtSecret = process.env.JWT_SECRET as string;
export class userService {
     static preRegister = async(user:IPreRegister)=> {
       
            const isFound = await UserRepository.findByEmail(user.email)
            if(isFound)throw newError("Please login with your registered email", 400)
            const otp = this.generateOtp(user.email)
            sendMail({
                email:user.email,
                subject:"OTP Verification",
                emailInfo:{
                    otp:otp.toString(),
                    name:`${user.last_name} ${user.first_name}`
                },
            },
            otpTemplate
        )
        return "A verfication code has been sent to your email"

    };

    static register = async (user:IRegister)=>{
        const isFound = await UserRepository.findByEmail(user.email)
        if(isFound) throw newError("Please login with your registered email", 400);

            const hashedPassword =await bcrypt.hash(user.password, 10);
            if(!hashedPassword)throw newError("Something went wrong", 400);

        const account = await UserRepository.register({...user, password:hashedPassword}, true);
        if(!account) throw newError("no account generated", 400);
        
        const accountNumber = await userService.genUniqueAccountNumber()
            if(accountNumber){
        const wallet = await walletRepository.createWallet({
           userId:account._id,
           accountNumber:accountNumber      
        });
        if(!wallet){
                await UserRepository.deleteById(account._id)
            }
            }
            
        return "Account created successfully"

    };

    static login = async(data:{email:string, password:string, ipAddress:string, userAgent:string})=>{
    
        const {email,password,ipAddress,userAgent} = data;
        const {error} = loginSchema.validate(data)
        if(error) throw newError(error?.message, 422)

        const user = await UserRepository.findByEmail(email)
        if(!user){
            throw newError("Invalid user account", 422)
        }
        const isAuth =await bcrypt.compare(password, user.password)
        if(!isAuth){
            throw newError("Incorrect email/password", 422)
        }
        const payload={
            message:"Success",
            email:email,
        }

          sendMail({
                email:email,
                subject:"Login confirmation",
                emailInfo:{
                name:`${user.last_name} ${user.first_name}`,
                ipAddress:ipAddress,
                userAgent:userAgent
                },
                
            },
            loginTemplate
        )

        const jwtToken = jwt.sign(payload, jwtSecret, {expiresIn:"1m"})
        return {
            message:payload,
            authKey:jwtToken
        } 

        
    };

     static fetchProfile = async(email:string)=>{
        const profile = await UserRepository.findByEmail(email)
        if(!profile){
            throw newError("User not found", 422)
        }
        return profile
     }

     static updateProfile = async(id:string, update:any)=>{
        if(!id){
                    throw newError("No record found", 422)
        }
        const convId = new Types.ObjectId(id)
        if(!convId){
            throw new Error("id is null")
        }
        const response = await UserRepository.updateUser(convId,update)
        if(!response){
            throw newError("something went wrong", 400)
        }
        return response
     }

     static updateProf = async(email:string, update:any)=>{
        const filter = {email}


        const response = await UserRepository.updateProf(filter,update)
        return response
     }

    static getBalance = async(accountNumber:string)=>{
        const user = await UserRepository.getBalance(accountNumber)
        if(!user){
            throw newError("No record found", 422)
        }
        return user
    }

    static transfer = async(accountNumber:string, update:Types.Decimal128)=>{
        const account = await UserRepository.getAcct(accountNumber)
        if(!account){
            throw newError("Invalid account number", 401)
        }

       if(!update){
            throw newError("Input an amount", 406)
       }
        //  const userAccount = await UserRepository.updateUserBalance(accountNumber, balance)
        // if(!userAccount){
        //     throw newError("unable to get user balance", 450)
       // } 
      
        const filter = {accountNumber}
        //  const update = balance:newBalance;
       // let newBalance =//
        const updat = {$add:[update, account.balance]}
        // const update = {updat}
        // const update = {balance:addNew} 
        const updatedbalance = await UserRepository.updateUserBalance(filter, updat)
       
       
        if(!updatedbalance){
            throw newError("unable to update user balance", 450)
        }
        //   const transfered = await transactionModels.create()
        // if(!transfered){
        //     throw newError("unable to carry out operation", 403)
        // }

        return `${accountNumber} balance is now ${updatedbalance}`

    }
    static forgotPassword =async(email:string)=>{
        const {error} = fgtPwdSchema.validate({email})
        if(error) throw newError(error.message, 422)
        const user = await UserRepository.findByEmail(email)
        if(!user){
            throw newError("invalid account", 401)
        }
        if(!user.is_verified){
            throw newError("Invalid information", 401)
        }
        const otp = this.generateOtp(email);
        //   sendMail({
        //         email:email,
        //         subject:"Reset Password",
        //         emailInfo:{
        //             otp:(await otp).toString(),
        //             name:`${user.last_name} ${user.first_name}`},
               
        //     },
        //     otpTemplate
        // );
          return "Email has been sent to your inbox"
    };

    static validateOtp = async(email:string, otp:string)=>{
        const user = await UserRepository.findByEmail(email)
        if(!user){
            throw newError("Inavlid account", 401)
        }
        if(!user.is_verified){
            throw newError("Invalid information", 401)
        }

        const isValid = await UserRepository.otpValidate(email,otp)
        if(!isValid){
            throw newError("invalid otp", 401)
    }
    return "otp verified"
    }

    static updatePassword = async(data:{email:string, otp:string, password:any, confirm:any})=>{
        const {email,otp,password,confirm} = data;
        const {error} = resetPwdSchema.validate(data)
        if(error) throw newError(error.message, 422)
        if(isNaN(parseInt(otp))) throw newError("otp must be digits", 424)
        const person = await UserRepository.findByEmail(email)
        if(!person){
            throw newError("No account found", 430)
        }
        const isValid = await UserRepository.otpValidate(email, otp)
        if(!isValid){
            throw newError("invalid otp", 422)
        }
        const filter = {email} 
        const hashedPassword = await bcrypt.hash(password, 10)
        if(confirm !== password){
            throw newError("password must match", 421)
        }
        const update = {password:hashedPassword}
        const pwd = await UserRepository.update(filter,update)
        if(!pwd){
            throw newError("failed to update", 420)
        }
        return pwd
    }



  static generateOtp = async(email:string) =>{
        const otp =  crypto.randomInt(100000, 999999);
        console.log("Generated Otp", otp)
        await otpModel.create({email, otp})
        return otp
    }
    static genUniqueAccountNumber = async()=>{
        let accountNumber = "";
        let inValid = true;
        do {
             accountNumber = userService.genAccountNumber()
             inValid = !inValid;
        } while (inValid);

        return accountNumber

    }

    static genAccountNumber(length=10){
        let accountNumber = "";
        const characters = "0123456789";
        for (let i = 0; i < length; i++){
            const randomIndex = Math.floor(Math.random() * characters.length)
            accountNumber += characters.charAt(randomIndex)
        }
        return accountNumber

    }
}