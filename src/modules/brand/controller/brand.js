import fs from 'fs'
import path from 'path';
import slugify from "slugify";
import Brand from "../../../../db/models/brand.model.js";
import { AppError } from "../../../utlis/appError.js";
import ApiFeatures from "../../../utlis/apiFeatures.js";

export const addBrand = async (req, res, next) => {
  const name = req.body.name
  const brandExist = await Brand.find({name})
  if(brandExist.length > 0){
    req.failedFile = req.file?.path
    return next(new AppError("This Brand is already exist.", 400))
  }
  req.body.slug = slugify(name)
  const image = req.file ? req.file.filename : null;
  if(image) req.body.image = image
  req.body.createdBy = req.authUser._id
  const brand = await Brand.create(req.body)
  return res.status(201).json({ message: "Brand added successfully." });
};

export const getBrands = async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Brand.find(), req.query)
  apiFeatures = apiFeatures.pagination().sort().search().select().filter()
  const brands = await apiFeatures.mongooseQuery
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

    // Check if Brand exist or not.
    const brandExist = await Brand.findById(_id)
    if(!brandExist){
      req.failedFile = req.file?.path
      return next(new AppError("This Brand is not found.", 404))
    }

    // Update name and image if exist in the database.
  if (req.body.name) req.body.slug = slugify(req.body.name);
  const image = req.file ? req.file.filename : null;
  if(image) req.body.image = image
  req.body.updatedBy = req.authUser._id
  
    // Delete the previous image from 'uploads' folder if exist.
      if(brandExist.image && image != null){
        const fileName = brandExist.image.split('/')[4]
        const filePath = path.join('src/uploads/brand/', fileName)
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
   // Update Brand.  
  const brand = await Brand.findByIdAndUpdate(_id, req.body, {new: true});
  return res.status(200).json({ message: "Brand updated successfully.", "Updated Brand" :brand });
};

export const deleteBrand = async (req, res, next) => {
  const { _id } = req.params;
  const brand = await Brand.findByIdAndDelete(_id);
  if(!brand) return next(new AppError("This brand is not found.", 404))

  // Delete the image from the 'uploads' folder if exist.  
  if(brand.image){
    const fileName = brand.image.split('/')[4]
    const filePath = path.join('src/uploads/brand/', fileName)
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
  res.status(200).json({ message: "Brand deleted successfully." });
};