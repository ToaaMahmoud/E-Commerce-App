import joi from 'joi'

export const loginVal = joi.object({
    // if user enter email then phone is optional and vice versa.
    phoneNumber:joi.string().when('email', {
        is: joi.required(),
        then: joi.optional(),
        otherwise: joi.required()
    }),
    email: joi.string().email(),
    passWord: joi.string()
})