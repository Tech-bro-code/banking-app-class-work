import { timeStamp } from "console";
import mongoose, {Schema} from "mongoose";


const transactionSchema = new Schema({
    amount:{type:Number, require:true},
    senders_account:{type:String, require:true},
    receivers_account:{type:String, require:true},
    status:{
        type:String,
        enum:["PENDIN", "FAILED", "COMPLETED"],
        default:"PENDING"}
},
{
timestamps:true}
);

export const transactionModels = mongoose.model("transaction", transactionSchema)
