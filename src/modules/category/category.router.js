import { Router } from "express";
import * as categoryController from './controller/category.js'
import { asyncHandler } from "../../utlis/asyncHandler.js";

const router = Router()
router
  .post("/add-category", asyncHandler(categoryController.addCategory))
  .get("/get-categories", asyncHandler(categoryController.getCategories))
  .get("/get-category/:_id", asyncHandler(categoryController.getCategory))
  .put("/update-category/:_id", asyncHandler(categoryController.updateCategory))
  .delete("/delete-category/:_id", asyncHandler(categoryController.deleteCategory))

export default router