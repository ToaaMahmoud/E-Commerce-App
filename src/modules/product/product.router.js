import { Router } from "express";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as productController from './controller/product.js'
import { createdMulter } from "../../middlewares/multer.js";
import validation from "../../middlewares/validation.middelware.js";
import { addProductSchema, updateProductSchema } from "./product.validation.js";
import { isAuthenticate, isAuthorized } from "../../middlewares/authenticate_authorizate.js";
import { role } from "../../utlis/constant/user_role.js";
const productRouter = Router()
productRouter
  .post(
    "/add-product",
    isAuthenticate(),
    isAuthorized([role.ADMIN, role.SELLER]),
    createdMulter("product").fields([
      { name: "mainImage", maxCount: 1 },
      { name: "coverImage", maxCount: 3 },
    ]),
    validation(addProductSchema),
    asyncHandler(productController.addProduct)
  )
  .get("/get-products", asyncHandler(productController.getProducts))
  .get("/get-product/:_id", asyncHandler(productController.getProduct))
  .put(
    "/update-product/:_id",
    isAuthenticate(),
    isAuthorized([role.ADMIN, role.SELLER]),
    createdMulter("product").fields([
      { name: "mainImage", maxCount: 1 },
      { name: "coverImage", maxCount: 3 },
    ]),
    validation(updateProductSchema),
    asyncHandler(productController.updateProduct)
  )
  .delete(
    "/delete-product/:_id",
    isAuthenticate(),
    isAuthorized([role.ADMIN, role.SELLER]),
    asyncHandler(productController.deleteProduct)
  );

export default productRouter;