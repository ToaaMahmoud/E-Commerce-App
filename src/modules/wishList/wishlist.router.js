import { Router } from "express";
import { isAuthenticate } from "../../middlewares/authenticate_authorizate.js";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as wishListController from './controller/wishlist.js'

const wishlistRouter = Router()

wishlistRouter
    .put('/add-to-wishlist/:productId', isAuthenticate(),asyncHandler(wishListController.addToWishlist))
    .get('/all-products', isAuthenticate(), asyncHandler(wishListController.getAllProductsFromWishlist))
    .delete('/delete-from-wishlist/:productId', isAuthenticate(), asyncHandler(wishListController.deleteFromWishlist))
export default wishlistRouter