
import mongoose, {Schema, Types} from "mongoose";


const otpSchema = new Schema({
    userId:{type:Types.ObjectId},
    email:{type:String, require:true},
    otp:{type:String, require:true},
    createdAt:{type:Date, default:Date.now, expires:"5m"}
})

export const otpModel = mongoose.model("otp", otpSchema)