import { Cart, Product } from "../../../../db/indexImportFilesDB.js"
import { AppError } from "../../../utlis/appError.js"


export const addToCart = async(req, res, next) =>{
    // get data from the req.
    const {productId, quantity} = req.body

    // check product existence.
    const productExist = await Product.findById(productId)
    if(!productExist) return next(new AppError("Product is not found.",404))

    // check the stock.
    if(!productExist.inStock(quantity)) return next (new AppError("Out of the stock.", 400))
    
    // check if product exist in the cart and update it.
    const productInCart = await Cart.findOneAndUpdate({user: req.authUser._id, 'products.productId': productId}, 
        {$set: {"products.$.quantity" : quantity}}, {new: true}).select('-_id -__v')
    
    let cart = productInCart
    if(!productInCart){
        // add new product to the cart.        
         cart = await Cart.findOneAndUpdate({user:req.authUser._id},{$push: {products: {productId, quantity}}}, {new: true})
    }    
    return res.status(200).json({message: "Product added to cart successfully.", Cart: cart})
}