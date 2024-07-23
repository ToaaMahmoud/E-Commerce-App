import { Router } from "express";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as brandController from "./controller/brand.js"
import { createdMulter } from "../../middlewares/multer.js";
const router = Router()
router
  .post("/add-brand",createdMulter('brand').single('image'), asyncHandler(brandController.addBrand))
  .get("/get-brands", asyncHandler(brandController.getBrands))
  .get("/get-brand/:_id", asyncHandler(brandController.getBrand))
  .put("/update-brand/:_id",createdMulter('brand').single('image'), asyncHandler(brandController.updateBrand))
  .delete("/delete-brand/:_id", asyncHandler(brandController.deleteBrand))

export default router