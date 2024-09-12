import Joi from "joi";
import { orderStatus } from "../../utlis/constant/order_type.js";

// create order.
export const createOrder = Joi.object({
    address: Joi.string().required(),
    phone: Joi.string().required(),
    payment: Joi.string().valid('cash', 'visa').required()
  });

  export const updateOrderSchema = Joi.object({
    status: Joi.string()
        .valid(...Object.values(orderStatus))
        .default(orderStatus.PLACED),
    _id: Joi.string().required(),
    address: Joi.string().optional(),
    phone: Joi.string().optional(),
    payment: Joi.string().valid('cash', 'visa').optional()
  });