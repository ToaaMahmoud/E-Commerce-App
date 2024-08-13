import { Router } from "express";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as authController from './controller/auth.js'
import { loginVal } from "./auth.validation.js";
import validation from "../../middlewares/validation.middelware.js";

const authRouter = Router()

authRouter
  .post("/sign-up", asyncHandler(authController.signUp))
  .get("/verify-email/:token", asyncHandler(authController.verifyEmail))
  .post("/login", validation(loginVal), asyncHandler(authController.login))
  .post("/forget-password", asyncHandler(authController.forgetPassword))
  .post("/change-password", asyncHandler(authController.changePassword))
export default authRouter