import slugify from "slugify";
import Category from "../../../../db/models/category.model.js";
import { AppError } from "../../../utlis/appError.js";

export const addCategory = async (req, res, next) => {
  const { name } = req.body;
  const slug = slugify(name);
  const category = new Category({
    name,
    slug,
  });
  await category.save();
  return res.status(201).json({ message: "Category added successfully." });
};

export const getCategories = async (req, res, next) => {
  const categories = await Category.find();
  return categories.length == 0
    ? next(new AppError("There is no Categories.", 404))
    : res.status(200).json({ "All categories are ": categories });
};

export const getCategory = async (req, res, next) => {
  const { _id } = req.params;
  const category = await Category.findById(_id);
  return !category
    ? next(new AppError("This category is not found.", 404))
    : res.status(200).json({ "The category is ": category });
};

export const updateCategory = async (req, res, next) => {
  const { _id } = req.params;
  const { ...updatedData } = req.body;
  if ("name" in updatedData) updatedData.slug = slugify(updatedData.name);
  const category = await Category.findByIdAndUpdate(_id, { ...updatedData }, {new: true});
  return !category
    ? next(new AppError("This category is not found.", 404))
    : res.status(200).json({ message: "Category updated successfully.", "Updated Category" :category });
};

export const deleteCategory = async (req, res, next) => {
  const { _id } = req.params;
  const category = await Category.findByIdAndDelete(_id);
  return !category
    ? next(new AppError("This category is not found.", 404))
    : res.status(200).json({ message: "Category deleted successfully." });
};