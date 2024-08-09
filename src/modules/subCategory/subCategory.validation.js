import joi from "joi";

// addSubCategorySchema
export const addSubCategorySchema = joi
.object({
  name: joi.string().required().min(2).max(20).trim(),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
  category: joi.string().required()
})
.required();


// updateSubCategorySchema
export const updateSubCategorySchema = joi
.object({
  name: joi.string().optional().min(2).max(20).trim(),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
  category: joi.string().optional(),
  _id: joi.string().required()
})
.required();