import { Router } from "express";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import * as subCategoryController from './controller/subCategory.js'
import { createdMulter } from "../../middlewares/multer.js";
import validation from "../../middlewares/validation.middelware.js";
import { addSubCategorySchema, updateSubCategorySchema } from "./subCategory.validation.js";
import { isAuthenticate, isAuthorized } from "../../middlewares/authenticate_authorizate.js";
import { role } from "../../utlis/constant/user_role.js";
const subCategoryRouter = Router({mergeParams: true})
subCategoryRouter
  .post("/add-subcategory",isAuthenticate(), isAuthorized([role.ADMIN, role.SELLER]),createdMulter('subCategory').single('image'),validation(addSubCategorySchema), asyncHandler(subCategoryController.addSubCategory))
  .get("/get-subcategories", asyncHandler(subCategoryController.getSubCategories))
  .get("/get-subcategory/:_id", asyncHandler(subCategoryController.getSubCategory))
  .put("/update-subcategory/:_id",isAuthenticate(), isAuthorized([role.ADMIN, role.SELLER]),createdMulter('subCategory').single('image'),validation(updateSubCategorySchema),asyncHandler(subCategoryController.updateSubCategory))
  .delete("/delete-subcategory/:_id",isAuthenticate(), isAuthorized([role.ADMIN, role.SELLER]),asyncHandler(subCategoryController.deleteSubCategory))

export default subCategoryRouter