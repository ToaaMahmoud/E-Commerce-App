import fs from 'fs'
import path from 'path'
import { AppError } from "./appError.js"

export function asyncHandler  (fn) {
    return async(req, res, next) =>{
        fn(req, res, next).catch(err =>{
            next(new AppError(err.message, 500))
        })
    }
}

export const globalErrorHandling = (err, req, res, next) =>{
    if(req.failedFile){
        fs.unlinkSync(req.failedFile)
    }
    return res.status(err.statusCode || 500).json({message:err.message, success: false, Position: err.stack})
}