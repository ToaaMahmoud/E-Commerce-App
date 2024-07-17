import { AppError } from "./appError.js"

export function asyncHandler  (fn) {
    return async(req, res, next) =>{
        fn(req, res, next).catch(err =>{
            next(new AppError(err.message, 500))
        })
    }
}

export const globalErrorHandling = (err, req, res, next) =>{
    return res.status(err.statusCode || 500).json({message:err.message, success: false, Position: err.stack})
}