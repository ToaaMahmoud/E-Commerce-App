import joi from "joi";

// add Brand.
export const addBrandSchema = joi
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
  })
  .required();

// update Brand.
export const updateBrandSchema = joi
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
  _id: joi.string().required()
})
.required();