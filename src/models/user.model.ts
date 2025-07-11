import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  first_name: { type: String, require: true },
  last_name: { type: String, require: true },
  password: { type: String, require: true },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  is_verified:{
    type:Boolean
  },
  gender: {
    type: String,
    require: true,
  },
  phone_number: {
    type: String,
    require: true,
    unique: true,
    partialFilterExpression:{
      phone_number:{$exist:true, $ne:null}
    }
  },
  location: {
    street: String,
    city: String,
    state: String,
    postcode: Number,
  },

  title: { type: String },
  picture: { type: String },
});

export const userModel = mongoose.model("User", userSchema);
