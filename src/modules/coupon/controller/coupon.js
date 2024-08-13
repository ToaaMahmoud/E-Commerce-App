import { Coupon } from "../../../../db/indexImportFilesDB.js"
import { AppError } from "../../../utlis/appError.js"
import { couponTypes } from "../../../utlis/constant/coupon_type.js"

export const createCoupon = async(req, res, next) =>{
    // get all data from req.
    const {couponCode, discountAmount, couponType, fromDate, toDate, maxUse} = req.body
    
    // check coupoun existence.
    const couponExist = await Coupon.findOne({couponCode})
    if(couponExist) return next(new AppError("Coupon is already exist.", 409))
    
    // check on coupon type.
    if(couponType == couponTypes.PERCENTAGE && discountAmount > 100) return next(new AppError("Coupon percentage amount must be less than or equal 100."), 400)
    
    // create coupon.    
    const coupon = await Coupon.create({couponCode, discountAmount, couponType, fromDate, toDate, maxUse,createdBy: req.authUser._id}) 
    if(!coupon) return next(new AppError("Failed to create coupon.", 500)) 
    return res.status(201).json({message: "Coupon created successfully.", data: coupon})
}