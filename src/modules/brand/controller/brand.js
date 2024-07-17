import slugify from "slugify";
import Brand from "../../../../db/models/brand.model.js";
import { AppError } from "../../../utlis/appError.js";

export const addBrand = async (req, res, next) => {
  const { name } = req.body;
  const slug = slugify(name);
  const category = new Brand({
    name,
    slug,
  });
  await category.save();
  return res.status(201).json({ message: "Brand added successfully." });
};

export const getBrands = async (req, res, next) => {
  const brands = await Brand.find();
  return brands.length == 0
    ? next(new AppError("There is no Brands.", 404))
    : res.status(200).json({ "All Brands are ": brands });
};

export const getBrand = async (req, res, next) => {
  const { _id } = req.params;
  const brand = await Brand.findById(_id);
  return !brand
    ? next(new AppError("This brand is not found.", 404))
    : res.status(200).json({ "The brand is ": brand });
};

export const updateBrand = async (req, res, next) => {
  const { _id } = req.params;
  const { ...updatedData } = req.body;
  if ("name" in updatedData) updatedData.slug = slugify(updatedData.name);
  const brand = await Brand.findByIdAndUpdate(_id, { ...updatedData }, {new: true});
  return !brand
    ? next(new AppError("This brand is not found.", 404))
    : res.status(200).json({ message: "Brand updated successfully.", "Updated Brand" :brand });
};

export const deleteBrand = async (req, res, next) => {
  const { _id } = req.params;
  const brand = await Brand.findByIdAndDelete(_id);
  return !brand
    ? next(new AppError("This brand is not found.", 404))
    : res.status(200).json({ message: "Brand deleted successfully." });
};