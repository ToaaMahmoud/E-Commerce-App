import { Cart, Order, Product } from "../../../../db/indexImportFilesDB.js"
import { createCheckOut, createStripeCooupon } from "../../../payment-handler/stripe.js"
import { AppError } from "../../../utlis/appError.js"
import { orderStatus } from "../../../utlis/constant/order_type.js"


export const createOrder = async (req, res, next) => {
    // get data from req.
    const { address, phone, payment } = req.body

    // check cart.
    const cart = await Cart.findOne({user: req.authUser._id})
    const products = cart.products
    if(products.length <= 0) return next(new AppError("Cart empty.", 400))

   // check products.
   let orderProducts = []
    for (const product of products) {
        const productExist = await Product.findById(product.productId);
        if (!productExist) {
            return next(new AppError(`Product not found "${product.productId}"`, 404));
        }
        if (!productExist.inStock(product.quantity)) {
            return next(new AppError(`This product '${productExist.title}' Out of stock, avaliable in the stock ${productExist.stock}`, 400));
        }
        orderProducts.push({
            productId: productExist._id,
            title: productExist.title,
            productPrice: productExist.price,
            quantity: product.quantity,
            totalPrice: product.quantity * productExist.price
        })
    }
    // update stock and sold fields in the database.
    for (const product of products) {
        await Product.findByIdAndUpdate(product.productId, {
            $inc: {sold:product.quantity,stock: -product.quantity} })
        }

    let status    
    if(payment == 'visa') {status = orderStatus.PENDING}
    else {status = orderStatus.PLACED}   

    // create new order.   
const order = new Order({
  user: req.authUser._id,
  products: orderProducts,
  address,
  phone,
  coupon: {
    couponId: cart?.coupon?.couponId,
    code: cart?.coupon.code,
    discount: cart?.coupon?.discount,
    discountType: cart?.coupon?.discountType
  },
  status:status,
  payment,
  orderPrice: cart?.totalPrice,
});
    // clear cart.
     cart.products = undefined
     cart.coupon = undefined
     cart.priceBeforeDiscount = undefined
     cart.discount = undefined
     cart.discountType = undefined
     cart.totalPrice = undefined
     await cart.save()

    // save to db.
    const orderCreated = await order.save()
    if(!orderCreated) return next(new AppError("Failed to create.", 500))

    return res.status(200).json({message: "Order created successfully.", data: orderCreated})   
}

export const getOrder = async(req, res, next) =>{
    const order = await Order.findById(req.params._id)
    if(!order) return next(new AppError("This order is not exist.", 404))
    return res.status(200).json({message: "The order is ", data: order})    
}

export const updateOrder = async(req, res, next) =>{
    // check if order exist or not.
    const order = await Order.findById(req.params._id)
    if(!order) return next(new AppError("This order is not exist.", 404))
    // update order.    
    const updatedOrder = await Order.findByIdAndUpdate(req.params._id, req.body, {new: true})
    return res.status(200).json({message: "Order updated successfully.", data: updatedOrder})
}

export const deleteOrder = async(req, res, next) =>{
    // check if order exist or not.
    const order = await Order.findById(req.params._id)
    if(!order) return next(new AppError("This order is not exist.", 404))
    await order.deleteOne()
    return res.status(200).json({message: "Order deleted successfully."})
}

export const allUserOrders = async(req, res, next) =>{
    const all = await Order.find({user: req.authUser._id}).select('-__v -createdAt -updatedAt')
    if(!all) return next(new AppError("There is no order.", 404))
    return res.status(200).json({message: "All orders ", data: all})    
}

export const paymentWithStripe = async (req, res, next) => {
    // Get order ID from request parameters
    const { orderId } = req.params;

    // Check if order exists and belongs to the authenticated user
    const orderExist = await Order.findOne({
        _id: orderId,
        user: req.authUser._id,
        status: orderStatus.PENDING,
    });
    if (!orderExist) return next(new AppError("Order not found.", 404));

    // Create payment object
    const paymentObj = {
        customer_email: req.authUser.email,
        metadata: {
            orderId: orderId.toString(),
        },
        discounts: [],
        line_items: orderExist.products.map((ele) => {
            return {
                price_data: {
                    currency: "egp",
                    unit_amount: Math.round(Number(ele.productPrice)) * 100,
                    product_data: {
                        name: req.authUser.userName,
                    },
                },
                quantity: ele.quantity,
            }
        }),
    };

    if(orderExist.coupon.couponId != undefined){
        const stripeCoupon = await createStripeCooupon({couponId: orderExist.coupon.couponId})
        if(stripeCoupon.status){
            return next(new AppError(stripeCoupon.message, 400))
        }
        paymentObj.discounts.push({coupon: stripeCoupon.id})
    }


    // Create a checkout session with Stripe
    const checkOut = await createCheckOut(paymentObj);

    // Send successful response with checkout data
    res.status(200).json({ message: "Payment initialized", data: checkOut });
};