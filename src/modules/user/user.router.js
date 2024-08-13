import { Router } from "express";
import { isAuthenticate } from "../../middlewares/authenticate_authorizate.js";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as userController from './controller/user.js'
const userRouter = Router()

userRouter
        .put('/reset-password', isAuthenticate(), asyncHandler(userController.resetPassword))
export default userRouter