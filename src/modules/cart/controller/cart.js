import { Cart, Coupon, Product } from "../../../../db/indexImportFilesDB.js"
import { AppError } from "../../../utlis/appError.js"
import { couponTypes } from "../../../utlis/constant/coupon_type.js";

async function calcTotalPrice(cart) {
    const priceBeforeDiscount = cart.products.reduce((total, product) => total += (product.price * product.quantity), 0);
    cart.priceBeforeDiscount = priceBeforeDiscount 

    if (cart.coupon && cart.coupon.couponId != undefined) {
        if (cart.coupon.discountType == couponTypes.FIXED_AMOUNT) {
            cart.totalPrice = cart.priceBeforeDiscount - cart.coupon?.discount;
        } else {
            cart.totalPrice = cart.priceBeforeDiscount - (cart.priceBeforeDiscount * (cart.coupon?.discount / 100));
        }
    } else {
        cart.totalPrice = priceBeforeDiscount;
    }

    await cart.save()
}

export const addToCart = async(req, res, next) =>{
    // get data from the req.
    const {productId, quantity} = req.body

    // check product existence.
    const productExist = await Product.findById(productId)
    if(!productExist) return next(new AppError("Product is not found.",404))

    // check the stock.
    if(!productExist.inStock(quantity)) return next (new AppError("Out of the stock.", 400))
        
    // check if product exist in the cart and update it.
    let cart = await Cart.findOneAndUpdate({user: req.authUser._id, 'products.productId': productId}, 
        {$set: {"products.$.quantity" : quantity}}, {new: true}).select('-__v -createdAt -updatedAt')
    
    if(cart){
        // update total price beforeTheDiscount.
        calcTotalPrice(cart)
    }
    if(!cart){
        // add new product to the cart.
        cart = await Cart.findOneAndUpdate({user: req.authUser._id},{$push: {products: {productId, quantity, price: productExist.price}}}, {new: true}).select('-__v -createdAt -updatedAt')
        calcTotalPrice(cart)
    }    
    return res.status(200).json({message: "Product added to cart successfully.", Cart: cart})
}

export const applyCoupon = async(req, res, next) =>{
    // get all data from the req.
    const {couponCode} = req.body

    // check coupon existence.
    const coupon = await Coupon.findOne({couponCode})
    if(!coupon) return next(new AppError("Coupon is no longer exist.", 400))
    
    // check coupon expiration.
    if(!coupon.isValidCoupon(coupon)) return next(new AppError("Coupon Expired.", 410))
  
    
    // check user used coupon before or not.
    const userUsedCoupon = coupon.assignedUsers.findIndex(ele => ele.user.toString() === (req.authUser._id).toString());

    if (
      userUsedCoupon !== -1 &&
      coupon.canUseCoupon(req.authUser._id, coupon)
    ) {
      coupon.assignedUsers[userUsedCoupon].numberOfUsage++;
    } else if (userUsedCoupon !== -1 && !coupon.canUseCoupon(req.authUser._id, coupon)) {
        return next(new AppError("Coupon limit-usage has been reached.", 401))
    } else {
      coupon.assignedUsers.push({
        user: req.authUser._id,
        numberOfUsage: 1,
      });
    }
     await coupon.save()

    // get user cart and add discount amount.
    const userCart = await Cart.findOne({user: req.authUser._id}).select('-__v -createdAt -updatedAt')
    const usedCoupon = {
        couponId: coupon._id,
        code: coupon.couponCode,
        discount: coupon.discountAmount,
        discountType: coupon.couponType
    }
    userCart.coupon = usedCoupon
    await userCart.save()   

    // apply discount.
    calcTotalPrice(userCart)

    return res.status(200).json({message: "Coupon used successfully.", Cart: userCart})
    
}

export const getAllProducts = async(req, res, next) =>{
    const userCart = await Cart.findOne({user: req.authUser._id}).select('-__v -createdAt -updatedAt -discountType')
    return res.status(200).json({message: "All products in the cart ", Cart: userCart})
}

export const deleteProductFromCart = async(req, res, next) =>{
    // get data from req.
    const {productId} = req.params

    // check product exist in the cart and delete it.
    const productInCart = await Cart.findOneAndUpdate({user: req.authUser._id, 'products.productId': productId}, 
        {$pull : {products: {productId}}}, {new: true})
        
    if(!productInCart) return next(new AppError("Product not found in the cart.", 404))

    // update total price of the cart.    
    calcTotalPrice(productInCart)

    return res.status(200).json({message: "Product deleted successfully.", Cart: productInCart})
}

export const clearCart = async(req, res, next) =>{
    // get data from req.
    const {cartId} = req.params

    // check if cart exist or not.
    const cart = await Cart.findById(cartId)
    if(!cart) return next(new AppError("Cart is not exist", 404))
   
    // check if cart is for that user.    
    if(toString(cart.user) != toString(req.authUser._id)) return next(new AppError("Not authorized.", 401))
    
    await cart.updateOne({
        priceBeforeDiscount:0, 
        discount: 0, 
        totalPrice: 0, 
        discountType: "fixedAmount",
        products: []
    })
    await cart.save()
    return res.status(200).json({message: "Cart cleared successfully."})
}