import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middlewares/authenticate_authorizate.js";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import validation from "../../middlewares/validation.middelware.js";
import { addReviewSchema } from "./review.validation.js";
import * as reviewController from './controller/review.js'
import { role } from "../../utlis/constant/user_role.js";

// only users bought the product can make review.
const reviewRouter = Router()
reviewRouter
        .post('/add-review', isAuthenticate(),validation(addReviewSchema) ,asyncHandler(reviewController.addReview))
        .get('/all-product-review', isAuthenticate(), asyncHandler(reviewController.getProductReview))
        .delete('/delete-review/:reviewId', isAuthenticate(), isAuthorized([role.ADMIN, role.CUSTOMER]), asyncHandler(reviewController.deleteReview))

export default reviewRouter