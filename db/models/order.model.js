import { Schema, model } from "mongoose";
import { orderStatus} from "../../src/utlis/constant/order_type.js";

const orderSchema = new Schema({
    user:{
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    products:[
        {
            productId: {
                type: Schema.ObjectId,
                ref: 'Product',
                required: true
            },
            title: String,
            productPrice: String,
            quantity: Number,
            totalPrice: Number
        }
    ],
    address: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
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
    status:{
        type: String,
        enum: Object.values(orderStatus),
        default: orderStatus.PLACED
    },
    payment:{
        type: String,
        enum : ['cash', 'visa'],
        required: true
    },
    orderPrice: Number,
}, {timestamps: true})

const Order = model('Order', orderSchema)

export default Order