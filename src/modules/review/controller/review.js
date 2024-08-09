import { Product, Review } from "../../../../db/indexImportFilesDB.js"
import { AppError } from "../../../utlis/appError.js"
import { role } from "../../../utlis/constant/user_role.js"

// only user bought the product can make review and only one review on the product.
export const addReview = async(req, res, next) =>{

    // get all date from req.
    const {comment, rate} = req.body
    const {productId} = req.query 

    // check existence of the product.
    const productExist = await Product.findById(productId).lean()
    if(!productExist) return next(new AppError("Product is not found.", 404))

    // todo check has order.

    // check user has review or not.(if user has review then he want to update it.)
    const reviewExist = await Review.findOneAndUpdate({user: req.authUser._id, product: productId}, {comment, rate}, {new: true})
    
    if(!reviewExist){
        const review = await Review.create({comment, rate, product: productId, user: req.authUser._id})
        if(!review){
            return next (new AppError("Failed to create review.", 500))
        }
        return res.status(201).json({message: "Review added successfully.", data: review})
    }
    return res.status(200).json({message: "Review updated successfully.", data: reviewExist})
}

export const getProductReview = async(req, res, next) =>{
    // get data from req.
    const {productId} = req.query

    // check existence of the product.
    const productExist = await Product.findById(productId).lean()
    if(!productExist) return next(new AppError("Product is not found.", 404))
    
    // get all reviews.
    const all = await Review.find({product: productId})    
    return res.status(200).json({message: "All reviews are ", data: all})
}

export const deleteReview = async(req, res, next) =>{
    // get data from req.
    const {reviewId} = req.params
    
    // check existence of review.
    const reviewExist = await Review.findById(reviewId).lean()
    if(!reviewExist) return next(new AppError("Review is not found.", 404))
    
    if(toString(reviewExist.user) != toString(req.authUser._id) && req.authUser.role != role.ADMIN) return next(new AppError("User is not authorized.", 401))
    await Review.findByIdAndDelete(reviewId)
    return res.status(200).json({message: "Review deleted successfully."})    
}