import { Router } from "express";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as brandController from "./controller/brand.js";
import { createdMulter } from "../../middlewares/multer.js";
import validation from "../../middlewares/validation.middelware.js";
import { addBrandSchema, updateBrandSchema } from "./brand.validation.js";
import {
  isAuthenticate,
  isAuthorized,
} from "../../middlewares/authenticate_authorizate.js";
import { role } from "../../utlis/constant/user_role.js";
const brandRouter = Router();
brandRouter
  .post(
    "/add-brand",
    isAuthenticate(),
    isAuthorized([role.ADMIN, role.SELLER]),
    createdMulter("brand").single("image"),
    validation(addBrandSchema),
    asyncHandler(brandController.addBrand)
  )
  .get("/get-brands", asyncHandler(brandController.getBrands))
  .get("/get-brand/:_id", asyncHandler(brandController.getBrand))
  .put(
    "/update-brand/:_id",
    isAuthenticate(),
    isAuthorized([role.ADMIN, role.SELLER]),
    createdMulter("brand").single("image"),
    validation(updateBrandSchema),
    asyncHandler(brandController.updateBrand)
  )
  .delete(
    "/delete-brand/:_id",
    isAuthenticate(),
    isAuthorized([role.ADMIN, role.SELLER]),
    asyncHandler(brandController.deleteBrand)
  );

export default brandRouter;
