import Joi from "joi";


// add category.
export const addCategorySchema = {
    body: Joi.object({
        name: Joi.string()
        .required()
        .min(2)
        .max(20)
        .trim()
    })
}

// updateCategory.
export const updateCategorySchema = {
    body: Joi.object({
        name: Joi.string()
        .required()
        .min(2)
        .max(20)
        .trim()
    }),
    // params: Joi.object({
    //     _id: Joi.string().required().hex()
    // })
}