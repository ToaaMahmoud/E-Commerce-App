import slugify from "slugify";
import SubCategory from "../../../../db/models/subCategory.model.js";
import { AppError } from "../../../utlis/appError.js";

export const addSubCategory = async (req, res, next) => {
  const { name, category } = req.body;
  const slug = slugify(name);
  const subCategory = new SubCategory({
    name,
    slug,
    category
  });
  await subCategory.save();
  return res.status(201).json({ message: "SubCategory added successfully." });
};

export const getSubCategories = async (req, res, next) => {
  const subCategories = await SubCategory.find();
  return subCategories.length == 0
    ? next(new AppError("There is no SubCategories.", 404))
    : res.status(200).json({ "All subCategories are ": subCategories });
};

export const getSubCategory = async (req, res, next) => {
  const { _id } = req.params;
  const subCategory = await SubCategory.findById(_id);
  return !subCategory
    ? next(new AppError("This subCategory is not found.", 404))
    : res.status(200).json({ "The subCategory is ": subCategory });
};

export const updateSubCategory = async (req, res, next) => {
  const { _id } = req.params;
  const { ...updatedData } = req.body;
  if ("name" in updatedData) updatedData.slug = slugify(updatedData.name);
  const subCategory = await SubCategory.findByIdAndUpdate(_id, { ...updatedData }, {new: true});
  return !subCategory
    ? next(new AppError("This subCategory is not found.", 404))
    : res.status(200).json({ message: "SubCategory updated successfully.", "Updated SubCategory" :subCategory });
};

export const deleteSubCategory = async (req, res, next) => {
  const { _id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(_id);
  return !subCategory
    ? next(new AppError("This subCategory is not found.", 404))
    : res.status(200).json({ message: "SubCategory deleted successfully." });
};