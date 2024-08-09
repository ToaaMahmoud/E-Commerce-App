
import joi from "joi";
import { role } from "../../utlis/constant/user_role.js";
import { status } from "../../utlis/constant/user_status.js";

export const addUserSchema = joi.object({
    userName: joi.string().required().trim(),
    email: joi.string().required().trim().lowercase().email(),
    phoneNumber: joi.string(),
    password: joi.string().required(),
    role: joi.string().valid(...Object.values(role)).default(role.CUSTOMER),
    status: joi.string().valid(...Object.values(status)).default(status.PENDING),
    isActive: joi.boolean().default(false),
    DOB: joi.date(),
    address: joi.array().items(
      joi.object({
        street: joi.string().required(),
        city: joi.string().required(),
        phone: joi.string()
      })
    ).required()
  });
  