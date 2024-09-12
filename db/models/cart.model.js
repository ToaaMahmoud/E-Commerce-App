
import { Schema, model } from "mongoose";
import { couponTypes } from "../../src/utlis/constant/coupon_type.js";

// cart will be first created automatically when user is verified in the system.
const cartSchema = new Schema({
    user:{
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: 
            {
                type: Schema.ObjectId,
                ref : 'Product',
            },
            quantity: {
                type: Number,
                default: 1
            },
            price:{
                type: Number,
                min: 0,
            }
        }
    ],
    priceBeforeDiscount:{
        type: Number,
        min:0,
        default: 0
    },
    totalPrice:{
        type: Number,
        min: 0,
        default: 0
    },
    coupon:{
        couponId : {
            type: Schema.ObjectId,
            ref: 'Coupon'
        },
        code: String,
        discount: Number,
        discountType: String
    },
}, {timestamps: true})

const Cart = model('Cart', cartSchema)
export default Cart