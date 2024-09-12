import Stripe from "stripe";
import { Coupon } from "../../db/indexImportFilesDB.js";
import { AppError } from "../utlis/appError.js";
import { couponTypes } from "../utlis/constant/coupon_type.js";

// create session.
export const createCheckOut = async(
    {customer_email,
     metadata, 
     discounts,
     line_items}
    ) =>{
const stripe = new Stripe(process.env.SECRET_STRIPE)

const paymentData = await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    mode: 'payment',
    customer_email,
    metadata,
    success_url: process.env.SUCESS_URL,
    cancel_url: process.env.CANCEL_URL,
    discounts,
    line_items
})
return paymentData
}

// create stripe coupon.
export const createStripeCooupon =  async({couponId}) =>{
    // check coupon existence.
    const coupon = await Coupon.findById(couponId)
    if(!coupon) return next(new AppError("Coupon not found.", 404))

    // check type of coupon.   
    let couponObj = {}
    if(coupon.couponType == couponTypes.FIXED_AMOUNT){
        couponObj = {
            name: coupon.couponCode,
            amount_off: coupon.discountAmount * 100,
            currency: "egp"
        }
    }
    if(coupon.couponType == couponTypes.PERCENTAGE){
        couponObj = {
            name: coupon.couponCode,
            percent_off: coupon.discountAmount
        }
    }

    const stripe = new Stripe(process.env.SECRET_STRIPE)
    const stripeCoupon = await stripe.coupons.create(couponObj)
    return stripeCoupon

}


