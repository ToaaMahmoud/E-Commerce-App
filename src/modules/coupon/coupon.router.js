import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middlewares/authenticate_authorizate.js";
import { role } from "../../utlis/constant/user_role.js";
import validation from "../../middlewares/validation.middelware.js";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as couponController from './controller/coupon.js'
import { addCouponSchema, updateCouponSchema } from "./coupon.validation.js";

const couponRouter = Router()

couponRouter
            .post('/add-coupon', isAuthenticate(), isAuthorized([role.ADMIN]), validation(addCouponSchema), asyncHandler(couponController.createCoupon))
            .get('/get-coupons', isAuthenticate(), isAuthorized([role.ADMIN]), asyncHandler(couponController.getCoupons))
            .put('/update-coupon/:_id', isAuthenticate(), isAuthorized([role.ADMIN]), validation(updateCouponSchema), asyncHandler(couponController.updateCoupon))
            .delete('/delete-coupon/:_id', isAuthenticate(), isAuthorized([role.ADMIN]), asyncHandler(couponController.deleteCoupon) )
export default couponRouter