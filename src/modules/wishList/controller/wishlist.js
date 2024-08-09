
import Product from "../../../../db/models/product.model.js"
import User from "../../../../db/models/user.model.js"
import { AppError } from "../../../utlis/appError.js"


export const addToWishlist = async(req, res, next)=>{
    // get data from req.
    const {productId} = req.params

    // check if product exist or not.
    const productExist = await Product.findById(productId).lean()
    if(!productExist) return next(new AppError("This product is no longer exist.", 404))
    
    // Check if product exist already in the wish list.
    const productExistsInList = req.authUser.wishList?.some(item => item.product?.equals(productId));
    if (productExistsInList) {
      return next (new AppError('Product already in wishlist'), 409);
    }   
    // add product to wish list of this user.
    const user = await User.findByIdAndUpdate(req.authUser._id, {$push: {wishList: {product : productId}} }, {new: true}).select('userName isActive role wishList -_id')   
    return res.status(200).json({message : "Wishlist updated successfully.", data: user}) 
}
export const getAllProductsFromWishlist = async(req, res, next) =>{
    const allProducts = await User.findById(req.authUser._id).select('wishList -_id')
    return res.status(200).json({message: "All Products in the list are ", data: allProducts})
}
export const deleteFromWishlist = async(req, res, next) =>{
    // get data from req.
    const {productId} = req.params

    // delete product from wishlist of user.
    const user = await User.findByIdAndUpdate(req.authUser._id, {$pull: {wishList:{product: productId}}}, {new: true}).select('userName isActive role wishList -_id')
    return res.status(200).json({message: "Product deleted successfully from the wish list.", data: user})
}