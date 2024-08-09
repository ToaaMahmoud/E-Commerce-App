import fs from 'fs'
import path from 'path'
import slugify from "slugify";
import Category from "../../../../db/models/category.model.js";
import { AppError } from "../../../utlis/appError.js";
import ApiFeatures from "../../../utlis/apiFeatures.js";

export const addCategory = async (req, res, next) => {
  const name = req.body.name
  const categoryExist = await Category.find({name})
  if(categoryExist.length > 0){
    req.failedFile = req.file?.path
    return next(new AppError("This Category is already exist.", 400))
  }
  req.body.slug = slugify(name)
  const image = req.file ? req.file.filename : null;
  if(image) req.body.image = image
  req.body.createdBy = req.authUser._id
  const category = await Category.create(req.body)
  return res.status(201).json({ message: "Category added successfully." });
};

export const getCategories = async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Category.find(), req.query)
  apiFeatures = apiFeatures.pagination().sort().search().select().filter()
  const categories = await apiFeatures.mongooseQuery
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

  // Check if Category exist or not.
  const categoryExist = await Category.findById(_id)
  if(!categoryExist){
    req.failedFile = req.file?.path
    return next(new AppError("This Category is not found.", 404))
  }
  // Update name and image if exist in the database.
  if (req.body.name) req.body.slug = slugify(req.body.name);
  const image = req.file ? req.file.filename : null;
  if(image) req.body.image = image
  req.body.updatedBy = req.authUser._id
  
    // Delete the previous image from 'uploads' folder if exist.
    if(categoryExist.image && image != null){
      const fileName = categoryExist.image.split('/')[4]
      const filePath = path.join('src/uploads/category/', fileName)
      if (fs.existsSync(filePath)) {
       try {
         fs.unlinkSync(filePath);
       } catch (err) {
         console.log("Error deleting previous image:", err);
       }
     }else {
       console.log("File does not exist:", filePath);
     }
   }
  
   // Update Category.
  const category = await Category.findByIdAndUpdate(_id,req.body, {new: true});
  return res.status(200).json({ message: "Category updated successfully.", "Updated Category" :category });
};

export const deleteCategory = async (req, res, next) => {
  const { _id } = req.params;
  const category = await Category.findByIdAndDelete(_id);
  if(!category) return next(new AppError("This category is not found.", 404))

  // Delete the image from the 'uploads' folder if exist.  
  if(category.image){
    const fileName = category.image.split('/')[4]
    const filePath = path.join('src/uploads/category/', fileName)
    if (fs.existsSync(filePath)) {
     try {
       fs.unlinkSync(filePath);
     } catch (err) {
       console.log("Error deleting previous image:", err);
     }
   }else {
     console.log("File does not exist:", filePath);
   }
  } 
  res.status(200).json({ message: "Category deleted successfully." });
};