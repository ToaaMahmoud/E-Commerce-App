import { Router } from "express";
import { isAuthenticate } from "../../middlewares/authenticate_authorizate.js";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as userController from './controller/user.js'
import validation from "../../middlewares/validation.middelware.js";
import { updateProfileSchema } from "./user.validation.js";
const userRouter = Router()

userRouter
        .put('/reset-password', isAuthenticate(), asyncHandler(userController.resetPassword))
        .get('/get-profile', isAuthenticate(), asyncHandler(userController.getProfile))
        .put('/update-profile-info', isAuthenticate(), validation(updateProfileSchema) ,asyncHandler(userController.updateProfile))
        .get("/update-profile-email/verify-email/:token", asyncHandler(userController.verifyEmail))
export default userRouter