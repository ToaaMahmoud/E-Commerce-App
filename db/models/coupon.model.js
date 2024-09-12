import { Schema, model } from "mongoose";
import { couponTypes } from "../../src/utlis/constant/coupon_type.js";
import { DateTime } from "luxon";

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    discountAmount: {
      type: Number,
      min: 1,
    },
    couponType: {
      type: String,
      enum: Object.values(couponTypes),
      default: couponTypes.FIXED_AMOUNT,
    },
    fromDate: {
      type: Date,
      default: Date.now(),
    },
    toDate: {
      type: Date,
      default: Date.now() + (24 * 60 * 60 * 1000), // default => ends at the second day.
    },
    assignedUsers: [{
        user:{
            type: Schema.ObjectId,
            ref: 'User'
        },
        numberOfUsage:{  // how many times user used this coupon.
            type: Number,
            default: 1
        }
    }],
    maxUse:{// max number user can use this coupon.
      type: Number,
      default: 1
    },
    createdBy:{
        type: Schema.ObjectId,
        ref: 'User'
      }
  },
  
  { timestamps: true }
);

// check coupon validation.
couponSchema.methods.isValidCoupon = function (coupon){
  const now = Date.now()  
  return coupon.fromDate <= now && coupon.toDate >= now ? true : false
}

// check if user can use the coupon according to maxuse time of the coupon.
couponSchema.methods.canUseCoupon = function(userId, coupon) {
  const user = coupon.assignedUsers.find(ele => ele.user.toString() === userId.toString())  
  return user.numberOfUsage < coupon.maxUse ? true : false
}

 const Coupon = model('Coupon', couponSchema)
 export default Coupon