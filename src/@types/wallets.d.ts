import { Types } from "mongoose";


export interface ICreateWallet {
    userId:Types.ObjectId,
    accountNumber:string,
}

export interface IAddWallet {
    userId:Types.ObjectId,
    accountNumber:string,
    amount:string
    balance:string
}