import { Types } from "mongoose";
import { IPreRegister, IRegister } from "../interface/user.register";
import { userModel } from "../models/user.model";
import { walletModel } from "../models/wallet.models";
import { transactionModels } from "../models/transsaction.models";
import { otpModel } from "../models/otp.models";
import { any, string } from "joi";


export class UserRepository{
    static register = async (user:IRegister, is_verified:boolean) =>{
        const response = await userModel.create({...user, is_verified:is_verified})
        if(!response) return null
        return response
    }

    // static transfer = async(filter:any, update:any)=>{
    //     const response = await walletModel.updateOne(filter, update, {new:true})
    //     if(!response) return null
    //     return response
    // };

    static getBalance = async(accountNumber:string)=>{
        const response = await walletModel.findOne({accountNumber}).select('-__v -updatedAt -createdAt -_id -userId -accountNumber')
        if(!response)return null
        return response

    }
    
    static getAcct = async(accountNumber:string)=>{
        const response = await walletModel.findOne({accountNumber})
        if(!response)return null
        return response
    }

    static updateUserBalance = async(filter:any,update:any)=>{
        const response = await walletModel.findOneAndUpdate(filter,update,{new:true})
        if(!response) return null
        return response
    }


    static findById = async (id:Types.ObjectId) =>{
        const response = await userModel.findById({_id:id})
        if(!response) return null
        return response

    };

    static findByEmail = async(email:string) :Promise<any>=>{
        const response = await userModel.findOne({email})
        if(!response) return null
        if(!response.is_verified) return null
        return response
    };

    static findbyNumber = async (phone_number:string) =>{
        const response = await userModel.findOne({phone_number})
        if (!response) return null 
        return response
    };

    static deleteById = async(userId:Types.ObjectId)=>{
        const response = await userModel.deleteOne({_id:userId})
        if(!response) return null
        return response
    };
    static otpValidate = async(email:string, otp:string)=>{
        const response = await otpModel.findOne({email, otp})
        if(!response) return null
        return response

    };

    static update = async(filter:any, update:any)=>{
        const response = await userModel.updateOne(filter,update, {new:true})
        if(!response) return null
        return response
    }
    
    static updateUser = async(id:Types.ObjectId, update:any)=>{
        const response = await userModel.findByIdAndUpdate(id,update, {new:true})
        if(!response) return null
        return response
    }

    static updateProf = async(filter:any, update:any)=>{
        const response = await userModel.findOneAndUpdate(filter,update,{new:true})
        return response
    }
    

}