import { Router } from "express";
import { isAuthenticate } from "../../middlewares/authenticate_authorizate.js";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as orderController from './controller/order.js'
import validation from "../../middlewares/validation.middelware.js";
import { createOrder, updateOrderSchema } from "./order.validation.js";

const orderRouter = Router()
orderRouter
        .post('/create-order', isAuthenticate(),validation(createOrder),asyncHandler(orderController.createOrder))
        .get('/get-order/:_id', isAuthenticate(), asyncHandler(orderController.getOrder))
        .put('/update-order/:_id', isAuthenticate(),validation(updateOrderSchema),asyncHandler(orderController.updateOrder))
        .delete('/delete-order/:_id', isAuthenticate(), asyncHandler(orderController.deleteOrder))
        .get('/all-orders', isAuthenticate(), asyncHandler(orderController.allUserOrders))
        .post('/stripe-pay/:orderId', isAuthenticate(), asyncHandler(orderController.paymentWithStripe))
export default orderRouter