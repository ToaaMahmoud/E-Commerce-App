import joi from "joi";

// addProductSchema
export const addProductSchema = joi
  .object({
    title: joi.string().required().min(2).max(2000).trim(),
    price: joi.number().required().min(0),
    stock: joi.number().required().min(0),
    sold: joi.number().optional().min(0),
    rateCount: joi.number().optional().min(0),
    rateAvg: joi.number().optional().min(0),
    category: joi.string().required(),
    subCategory: joi.string().required(),
    brand: joi.string().required(),
    files: joi.object({
      mainImage: joi.array().items(
        joi.object({
          size: joi.number().positive().required(),
          path: joi.string().required(),
          filename: joi.string().required(),
          destination: joi.string().required(),
          mimetype: joi.string().required(),
          encoding: joi.string().required(),
          originalname: joi.string().required(),
          fieldname: joi.string().required(),
        })
      ),
      coverImage: joi.array().items(
        joi.object({
          size: joi.number().positive().required(),
          path: joi.string().required(),
          filename: joi.string().required(),
          destination: joi.string().required(),
          mimetype: joi.string().required(),
          encoding: joi.string().required(),
          originalname: joi.string().required(),
          fieldname: joi.string().required(),
        })
      ),
    }),
  })
  .required();


  // UpdateProductSchema
export const updateProductSchema = joi
.object({
  title: joi.string().optional().min(2).max(2000).trim(),
  price: joi.number().optional().min(0),
  stock: joi.number().optional().min(0),
  sold: joi.number().optional().min(0),
  rateCount: joi.number().optional().min(0),
  rateAvg: joi.number().optional().min(0),
  category: joi.string().optional(),
  subCategory: joi.string().optional(),
  brand: joi.string().optional(),
  files: joi.object({
    mainImage: joi.array().items(
      joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required(),
      })
    ),
    coverImage: joi.array().items(
      joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required(),
      })
    ),
  }),
  _id: joi.string().required()
})
.required();
