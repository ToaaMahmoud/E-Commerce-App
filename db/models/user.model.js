import {Schema, model} from 'mongoose'
import { role } from '../../src/utlis/constant/user_role.js';
import {status} from'../../src/utlis/constant/user_status.js'
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    passWord: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(role), // Customer Admin Seller
      default: role.CUSTOMER,
    },
    status: {
      type: String,
      enum: Object.values(status), // pending verified blocked
      default: status.PENDING,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    // image: {type: Object, default:{secure_url:, public_id}},
    DOB: Date,
    address: {
      type: [
        {
          street: String,
          city: String,
          phone: String,
        },
      ],
      required: true,
    },
    wishList: [
      {
        product: {
          type: Schema.ObjectId,
          ref: "Product",
        },
      },
    ],
    otp: String,
    expireDateOtp : Date
  },
  { timestamps: true }
);

const User =  model('User', userSchema)

export default User