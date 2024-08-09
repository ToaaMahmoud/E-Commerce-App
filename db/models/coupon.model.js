import { Schema, model } from "mongoose";
import { couponTypes } from "../../src/utlis/constant/coupon_type.js";

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
      type: String,
      default: Date.now(),
    },
    toDate: {
      type: String,
      default: Date.now() + (24 * 60 * 60 * 1000), // default => ends at the second day.
    },
    assignedUsers: [{
        user:{
            type: Schema.ObjectId,
            ref: 'User'
        },
        maxUse:{  // user can use this coupon 10 times here.
            type: Number,
            max: 10
        }
    }],
    createdBy:{
        type: Schema.ObjectId,
        ref: 'User'
      }
  },
  
  { timestamps: true }
);

 const Coupon = model('Coupon', couponSchema)
 export default Coupon