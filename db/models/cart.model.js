
import { Schema, model } from "mongoose";

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
            }
        }
    ]
}, {timestamps: true})


const Cart = model('Cart', cartSchema)
export default Cart