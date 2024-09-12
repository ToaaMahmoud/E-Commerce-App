import { Cart, Order, Review } from "../../../../db/indexImportFilesDB.js"
import User from "../../../../db/models/user.model.js"
import { AppError } from "../../../utlis/appError.js"
import { role } from "../../../utlis/constant/user_role.js"
import { status } from "../../../utlis/constant/user_status.js"


export const addUser = async(req, res, next) =>{
    // get all data from the req.
    const {userName, passWord, email, phoneNumber} = req.body
    
    
    // check user existence.
    const userExist = await User.findOne({$or:[{email}, {phoneNumber}]})
    
    if(userExist?.email == email) return next(new AppError("Email is aleady exist.", 409))
    else if(userExist?.phoneNumber == phoneNumber) return next(new AppError("Phone Number is aleady exist.", 409))

    // prepare data
    
    const createdUser = await User.create({
      userName,
      email,
      phoneNumber,
      role: role.CUSTOMER,
      status: status.VERIFIED,
      passWord:'e-commerce',
    });
    if(!createdUser) return next(new AppError("Failed to create user account.", 500))
     return res.status(201).json({message: "Account Created Successfully.", data: createdUser})      
}

export const deleteUser = async(req, res, next) =>{
  // get data from req.
  const {userId} = req.params

  // delete user orders.
  await Order.deleteMany({user:userId})

  // delete user reviews.
  await Review.deleteMany({user:userId})
  
  // delete user Cart.
  await Cart.findOneAndDelete({user: userId})

  // delete user.
  await User.deleteOne()

  return res.status(200).json({message: "User deleted successfully."})

}