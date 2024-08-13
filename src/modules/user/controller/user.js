import { User } from "../../../../db/indexImportFilesDB.js"
import { AppError } from "../../../utlis/appError.js"
import { comparPassword, hashPassword } from "../../../utlis/hash_and_compare.js"

export const resetPassword = async(req, res, next) =>{
    // get data from req.
    const {oldPassword, newPassword} = req.body

    // check user password.
    const match = comparPassword(oldPassword, req.authUser.passWord )
    if(!match) return next(new AppError("Invalid Credentials.", 401))
    
    // hash new password 
    const hashedPassword = hashPassword(newPassword, 8)
    
    // update user password.
    await User.findByIdAndUpdate(req.authUser._id, {passWord: hashedPassword}, {new: true})

    return res.status(200).json({message: "Password updated successfully."})
}   
