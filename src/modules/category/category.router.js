import { Router } from "express";
import * as categoryController from './controller/category.js'
import { asyncHandler } from "../../utlis/asyncHandler.js";
import { validation } from "../../middlewares/validation.middelware.js";
import { addCategorySchema, updateCategorySchema } from "./category.validation.js";
import { createdMulter, customValidation } from "../../middlewares/multer.js";

const router = Router()
router
  .post("/add-category",createdMulter('category').single('image'), asyncHandler(categoryController.addCategory))
  .get("/get-categories",asyncHandler(categoryController.getCategories))
  .get("/get-category/:_id", asyncHandler(categoryController.getCategory))
  .put("/update-category/:_id",createdMulter('category').single('image'), asyncHandler(categoryController.updateCategory))
  .delete("/delete-category/:_id", asyncHandler(categoryController.deleteCategory))

export default router