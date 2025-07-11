import { ICreateWallet } from "../@types/wallets";
import { walletModel } from "../models/wallet.models";



export class walletRepository{
    static createWallet = async(wallet:ICreateWallet) =>{
        const response = await walletModel.create({
          userId:wallet.userId,
          accountNumber:wallet.accountNumber
        })
        return response
    }


    static accountNumber = async(accountNumber:string)=>{
        const response = await walletModel.findOne({accountNumber})
        if(!accountNumber) return null
        return response

    }
}