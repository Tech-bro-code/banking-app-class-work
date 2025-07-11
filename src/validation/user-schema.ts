 import Joi from "joi";

export const preRegisterSchema = Joi.object({
  first_name:Joi.string().required(),
  last_name:Joi.string().required(),
  email: Joi.string().email().required(),
});

export const registerSchema = Joi.object({
   first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  otp:Joi.required()

})

export const loginSchema = Joi.object({
  email:Joi.string().email().required(),
  password:Joi.string().required().length(6)
});

export const fgtPwdSchema = Joi.object({
  email:Joi.string().email().required(),

})

export const resetPwdSchema = Joi.object({
   email:Joi.string().email().required(),
  otp:Joi.string().length(6).required(),
  password:Joi.string().min(6).required(),
  confirm:Joi.string().min(6).required()


})



export const addUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  age: Joi.number().integer().required(),
  title: Joi.string().required(),
  picture: Joi.string().required(),
  id: Joi.number().required(),
  location: {
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    postcode: Joi.number(),
  },
});
