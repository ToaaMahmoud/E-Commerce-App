import fs from 'fs'
import path from 'path';
import slugify from "slugify";
import { AppError } from "../../../utlis/appError.js";
import ApiFeatures from "../../../utlis/apiFeatures.js";
import { Product , SubCategory} from '../../../../db/indexImportFilesDB.js';

export const addSubCategory = async (req, res, next) => {
  const name = req.body.name
  const subCategoryExist = await SubCategory.find({name})
  if(subCategoryExist.length > 0){
    req.failedFile = req.file?.path
    return next(new AppError("This subCategory is already exist.", 400))
  }
   req.body.slug = slugify(name)
   const image = req.file ? req.file.filename : null;
   if(image) req.body.image = image
   req.body.createdBy = req.authUser._id
   const subCategory = await SubCategory.create(req.body) 
  return res.status(201).json({ message: "SubCategory added successfully." });
};

export const getSubCategories = async (req, res, next) => {
  let apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
  apiFeatures = apiFeatures.pagination().sort().search().select().filter()
  const subCategories = await apiFeatures.mongooseQuery.populate('category');
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

  // Check if subCategory exist or not.
  const subCategoryExist = await SubCategory.findById(_id)
  if(!subCategoryExist) {
    req.failedFile = req.file?.path
    return next(new AppError("This subCategory is not found.", 404))
  }

  // Update name and image if exist in the database.
    if(req.body.name) req.body.slug = slugify(req.body.name)
    const image = req.file ? req.file.filename : null;
    if(image) req.body.image = image
    req.body.updatedBy = req.authUser._id
  // Delete the previous image from 'uploads' folder if exist.
  if(subCategoryExist.image && image != null){
     const fileName = subCategoryExist.image.split('/')[4]
     const filePath = path.join('src/uploads/subCategory/', fileName)
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
// Update subCategory.
  const subCategory = await SubCategory.findByIdAndUpdate(_id, req.body, {new: true}).populate('category');
  return res.status(200).json({ message: "SubCategory updated successfully.", "Updated SubCategory" :subCategory });
};

export const deleteSubCategory = async (req, res, next) => {
  const { _id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(_id)
  if(!subCategory) return next(new AppError("This subCategory is not found.", 404))
  
  // Delete related products.
  await Product.deleteMany({ subCategory: _id });

  // Delete the image from the 'uploads' folder if exist.  
  if(subCategory.image){
    const fileName = subCategory.image.split('/')[4]
    const filePath = path.join('src/uploads/subCategory/', fileName)
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
  return res.status(200).json({ message: "SubCategory deleted successfully." });
};