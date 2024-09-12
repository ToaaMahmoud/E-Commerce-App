import { Router } from "express";
import { isAuthenticate } from "../../middlewares/authenticate_authorizate.js";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as addressController from './controller/address.js'

const addressRouter = Router()
addressRouter
            .post("/add-address", isAuthenticate(), asyncHandler(addressController.addAddress))
            .get("/get-address", isAuthenticate(), asyncHandler(addressController.getAddress))
            .delete("/delete-address/:_id", isAuthenticate(), asyncHandler(addressController.deleteAddress))
            .put("/update-address/:_id", isAuthenticate(), asyncHandler(addressController.updateAddress))

export default addressRouter