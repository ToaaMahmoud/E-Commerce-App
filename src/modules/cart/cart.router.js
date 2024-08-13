
import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middlewares/authenticate_authorizate.js";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as cartController from "./controller/cart.js"
import { role } from "../../utlis/constant/user_role.js";

const cartRouter = Router()

cartRouter
        .post('/add-to-cart', isAuthenticate(), asyncHandler(cartController.addToCart))
        .post('/apply-coupon', isAuthenticate(), asyncHandler(cartController.applyCoupon))
        .get('/all-products-in-cart', isAuthenticate(), asyncHandler(cartController.getAllProducts))
        .delete('/remove-product/:productId', isAuthenticate(), isAuthorized([role.CUSTOMER, role.ADMIN]), asyncHandler(cartController.deleteProductFromCart))
export default cartRouter