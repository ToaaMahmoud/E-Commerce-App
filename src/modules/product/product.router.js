import { Router } from "express";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as productController from './controller/product.js'
import { createdMulter } from "../../middlewares/multer.js";
const router = Router()
router
  .post("/add-product",createdMulter('product').fields([{name: 'mainImage', maxCount: 1}, {name: 'coverImage', maxCount: 3}]), asyncHandler(productController.addProduct))
  .get("/get-products", asyncHandler(productController.getProducts))
  .get("/get-product/:_id", asyncHandler(productController.getProduct))
  .put("/update-product/:_id",createdMulter('product').fields([{name: 'mainImage', maxCount: 1}, {name: 'coverImage', maxCount: 3}]), asyncHandler(productController.updateProduct))
  .delete("/delete-product/:_id", asyncHandler(productController.deleteProduct))

export default router