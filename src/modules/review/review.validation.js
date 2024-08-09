import joi from "joi";

export const addReviewSchema = joi.object({
    comment:joi.string().required(),
    rate: joi.number().min(0).max(5),
    productId: joi.string().required()
}).required()