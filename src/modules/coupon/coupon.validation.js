

import joi from "joi";
import { couponTypes } from "../../utlis/constant/coupon_type.js";

export const addCouponSchema = joi.object({
  couponCode: joi.string().length(7).required(),
  discountAmount: joi.number().positive().min(1),
  fromDate: joi.date().greater(Date.now() - (24*60*60*1000)).required(), // must be greater than or equal date now.
  toDate: joi.date().greater(joi.ref('fromDate')).required(), // must be greater than the fromDate.
  couponType: joi.string().valid(...Object.values(couponTypes)).default(couponTypes.FIXED_AMOUNT),
  maxUse: joi.number()
}).required()

export const updateCouponSchema = joi.object({
  couponCode: joi.string().length(7),
  discountAmount: joi.number().positive().min(1),
  toDate: joi.date().greater(Date.now() - (24*60*60*1000)),
  couponType: joi.string().valid(...Object.values(couponTypes)).default(couponTypes.FIXED_AMOUNT),
  maxUse: joi.number(),
  _id: joi.string()
}).required()