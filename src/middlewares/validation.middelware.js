import { AppError } from "../utlis/appError.js"

const reqKeys = ["body", "params", "query", "headers"]

export const validation = (schema) =>{
    return (req, res, next) =>{
        let validationErrors = []
        for (const key of reqKeys) {
            const result = schema[key]?.validate(req[key],{abortEarly: false})
            if(result?.error) validationErrors.push(result.error.details)
    }
     validationErrors > 0
       ? next(new AppError(`Validation Errors: ${validationErrors}`, 400))
       : next();
}
}