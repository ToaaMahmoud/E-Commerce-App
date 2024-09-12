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

export const getCoupons = async(req, res, next) =>{
    const all = await Coupon.find()
    if(all.length == 0) return next(new AppError("There is no coupon.", 404))
    return res.status(200).json({message: "All coupons ", data: all})
}

export const updateCoupon = async(req, res, next) =>{
    // get coupon id from params.
    const {_id}  = req.params

    // check if coupon exist or not.
    const couponExist = await Coupon.findById(_id)
    if(!couponExist) return next(new AppError("Coupon is not exist.", 404))
    
    // update coupon data.
    const updateCoupon = await Coupon.findByIdAndUpdate(_id, req.body, {new:true})  
    return res.status(200).json({message: "Coupon updated successfully.", data: updateCoupon})  
}

export const deleteCoupon = async(req, res, next) =>{
    // check if coupon exist or not.
    const couponExist = await Coupon.findById(req.params._id)
    if(!couponExist) return next(new AppError("Coupon is not exist.", 404))

    // delete coupon.    
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params._id)
    return res.status(200).json({message: "Coupon deleted successfully."})
}