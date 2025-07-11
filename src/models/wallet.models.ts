import { timeStamp } from "console";
import mongoose, {Schema, Types} from "mongoose";

const walletSchema = new Schema({
    userId:{type: Types.ObjectId, require:true, unique:true, ref:"User"},
    accountNumber:{type: String, require:true, unique:true},
    balance:{type:Types.Decimal128, default:0},
    status:{type:String, enum:["FROZEN", "ACTIVE", "INACTIVE"], default:"ACTIVE"},
    transactionPin:{type:String},   
},
{timestamps:true}
)

export const walletModel = mongoose.model("wallet", walletSchema)