import Joi from "joi";

export const updateProfileSchema = Joi.object({
    userName: Joi.string().optional().trim(),
    email: Joi.string().optional().trim().lowercase(),
    phoneNumber: Joi.string().allow(''), // Allow empty phone number
    DOB: Joi.date()
  });