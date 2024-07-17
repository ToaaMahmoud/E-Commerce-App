import { Router } from "express";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as brandController from "./controller/brand.js"
const router = Router()
router
  .post("/add-brand", asyncHandler(brandController.addBrand))
  .get("/get-brands", asyncHandler(brandController.getBrands))
  .get("/get-brand/:_id", asyncHandler(brandController.getBrand))
  .put("/update-brand/:_id", asyncHandler(brandController.updateBrand))
  .delete("/delete-brand/:_id", asyncHandler(brandController.deleteBrand))

export default router