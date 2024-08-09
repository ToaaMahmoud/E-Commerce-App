import slugify from "slugify";
import Product from "../../../../db/models/product.model.js";
import { AppError } from "../../../utlis/appError.js";
import ApiFeatures from "../../../utlis/apiFeatures.js";

export const addProduct = async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  const mainImage = req.files.mainImage ? req.files.mainImage[0].filename : null;
  if(mainImage) req.body.mainImage = mainImage
  const coverImages = req.files.coverImage?.map(image => image.filename);
  if (coverImages) {
    req.body.coverImage = coverImages;
  }
  req.body.createdBy = req.authUser._id
 const product = await Product.create(req.body)
//  await product.save()
  return res.status(201).json({ message: "Product added successfully." });
};

export const getProducts = async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Product.find(), req.query)
  apiFeatures = apiFeatures.pagination().sort().search().select().filter()
  const products = await apiFeatures.mongooseQuery.populate('category').populate('subCategory').populate('brand');
  return products.length == 0
    ? next(new AppError("There is no Products.", 404))
    : res.status(200).json({"All products are ": products });
};

export const getProduct = async (req, res, next) => {
  const { _id } = req.params;
  const product = await Product.findById(_id).populate('category').populate('subCategory').populate('brand');
  return !product
    ? next(new AppError("This product is not found.", 404))
    : res.status(200).json({ "The product is ": product });
};

export const updateProduct = async (req, res, next) => {
  const { _id } = req.params;
  // Move mainImage and coverimage from req.files to req.body.
  if (req.body.title) req.body.slug = slugify(req.body.title);
  const mainImage = req.files.mainImage ? req.files.mainImage[0].filename : null;
  if(mainImage) req.body.mainImage = mainImage
  const coverImages = req.files.coverImage?.map(image => image.filename);
  if (coverImages) {
    req.body.coverImage = coverImages;
  }
  req.body.updatedBy = req.authUser._id
  // Check if the product exist or not and update it .
  const product = await Product.findByIdAndUpdate(_id, req.body, {new: true});
  return !product
    ? next(new AppError("This product is not found.", 404))
    : res.status(200).json({ message: "Product updated successfully.", "Updated Product" :product });
};

export const deleteProduct = async (req, res, next) => {
  const { _id } = req.params;
  const product = await Product.findByIdAndDelete(_id);
  return !product
    ? next(new AppError("This product is not found.", 404))
    : res.status(200).json({ message: "Product deleted successfully." });
};