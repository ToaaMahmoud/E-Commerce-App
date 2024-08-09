import { Router } from "express";
import * as categoryController from "./controller/category.js";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import validation from "../../middlewares/validation.middelware.js";
import {
  addCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";
import { createdMulter } from "../../middlewares/multer.js";
import subCategoryRouter from "../subCategory/subCategory.router.js";
import {
  isAuthenticate,
  isAuthorized,
} from "../../middlewares/authenticate_authorizate.js";
import { role } from "../../utlis/constant/user_role.js";

const categoryRouter = Router();
categoryRouter
  .post(
    "/add-category",
    isAuthenticate(),
    isAuthorized([role.ADMIN, role.SELLER]),
    createdMulter("category").single("image"),
    validation(addCategorySchema),
    asyncHandler(categoryController.addCategory)
  )
  .get("/get-categories", asyncHandler(categoryController.getCategories))
  .get("/get-category/:_id", asyncHandler(categoryController.getCategory))
  .put(
    "/update-category/:_id",
    isAuthenticate(),
    isAuthorized([role.ADMIN, role.SELLER]),
    createdMulter("category").single("image"),
    validation(updateCategorySchema),
    asyncHandler(categoryController.updateCategory)
  )
  .delete(
    "/delete-category/:_id",
    isAuthenticate(),
    isAuthorized([role.ADMIN, role.SELLER]),
    asyncHandler(categoryController.deleteCategory)
  )
  .use("/:_id/sub-categories", subCategoryRouter);

export default categoryRouter;
