
import { Router } from "express";
import { isAuthenticate } from "../../middlewares/authenticate_authorizate.js";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as cartController from "./controller/cart.js"

const cartRouter = Router()

cartRouter.post('/add-to-cart', isAuthenticate(), asyncHandler(cartController.addToCart))
export default cartRouter