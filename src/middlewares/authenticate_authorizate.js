import User from "../../db/models/user.model.js"
import { AppError } from "../utlis/appError.js"
import { status } from "../utlis/constant/user_status.js"
import { verifyToken } from "../utlis/token.js"

// check user is exist and loged in or not.
export const isAuthenticate = ()=>{
    return async(req, res, next)=>{
        const {token} = req.headers
        // check if token is't sent from front end.
        if(!token) return next(new AppError("Token required.", 401))
        
        // check if token is valid or not.
        let payload = null    
        try {
          payload = verifyToken(token, process.env.SECRETKEYLOGIN)
        } catch (error) {
          return next(new AppError(error.message, 500))
        }
        if(!payload?._id) return next(new AppError("Invalid payload.", 401))
          
        // check if user with that token is exist in the system or not.
        const user = await User.findById(payload._id)
        if(!user) return next(new AppError("User is no longer exist.", 401))
        if(user.isActive == false) return next(new AppError("Please, login first."))  
        req.authUser = user    
        next()       
    }
}

// check if user has autherization to do something or not (by user role.).
export const isAuthorized = (roles = [])=>{
  return (req, res, next) =>{
    const user = req.authUser
    if(!roles.includes(user.role)) return next(new AppError("Not auathorized.", 401))
    next()
  }
}