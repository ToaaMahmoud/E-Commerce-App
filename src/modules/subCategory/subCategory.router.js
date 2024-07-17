import { Router } from "express";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as subCategoryController from './controller/subCategory.js'
const router = Router()
router
  .post("/add-subcategory", asyncHandler(subCategoryController.addSubCategory))
  .get("/get-subcategories", asyncHandler(subCategoryController.getSubCategories))
  .get("/get-subcategory/:_id", asyncHandler(subCategoryController.getSubCategory))
  .put("/update-subcategory/:_id", asyncHandler(subCategoryController.updateSubCategory))
  .delete("/delete-subcategory/:_id", asyncHandler(subCategoryController.deleteSubCategory))

export default router