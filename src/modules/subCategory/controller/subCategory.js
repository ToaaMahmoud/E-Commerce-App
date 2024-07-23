import slugify from "slugify";
import SubCategory from "../../../../db/models/subCategory.model.js";
import { AppError } from "../../../utlis/appError.js";

export const addSubCategory = async (req, res, next) => {
   if(req.body.name) req.body.slug = slugify(req.body.name)
   const image = req.file ? req.file.filename : null;
   if(image) req.body.image = image
   console.log(image);
   const category = await SubCategory.create(req.body) 
  return res.status(201).json({ message: "SubCategory added successfully." });
};

export const getSubCategories = async (req, res, next) => {
  const subCategories = await SubCategory.find().populate('category');
  return subCategories.length == 0
    ? next(new AppError("There is no SubCategories.", 404))
    : res.status(200).json({ "All subCategories are ": subCategories });
};

export const getSubCategory = async (req, res, next) => {
  const { _id } = req.params;
  const subCategory = await SubCategory.findById(_id).populate('category');
  return !subCategory
    ? next(new AppError("This subCategory is not found.", 404))
    : res.status(200).json({ "The subCategory is ": subCategory });
};

export const updateSubCategory = async (req, res, next) => {
  const { _id } = req.params;
  if(req.body.name) req.body.slug = slugify(req.body.name)
    const image = req.file ? req.file.filename : null;
    if(image) req.body.image = image
  const subCategory = await SubCategory.findByIdAndUpdate(_id, req.body, {new: true}).populate('category');
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