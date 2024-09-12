import { User } from "../../../../db/indexImportFilesDB.js"
import { AppError } from "../../../utlis/appError.js"

export const addAddress = async(req, res, next) =>{
    // get data form req.
    const {address} = req.body

    // add address.
    const addAddress = await User.findByIdAndUpdate(req.authUser._id, {$addToSet: {address}}, {new: true})
    return res.status(201).json({message: "Address added successfully.", data: addAddress})
}
export const deleteAddress = async(req, res, next) =>{
    // get data from req.
     const {_id} = req.params
    const deletedAddress = await User.findByIdAndUpdate(req.authUser._id, {
        $pull: {address:{_id}}
    }, {new: true})
    return res.status(200).json({message: "Address deleted successfully.", data: deletedAddress})
}
export const updateAddress = async(req, res, next) =>{
    const foundAddress = req.authUser.address.find(el => el._id == req.params._id);
    if(!foundAddress) return next(new AppError("This address is not exist.", 404))
    foundAddress.street = req.body?.street
    foundAddress.city = req.body?.city
    foundAddress.phone = req.body?.phone
    await req.authUser.save()
    return res.status(200).json({message: "Address updated successfully."})
}
export const getAddress = async(req, res, next) =>{
    const user = await User.findById(req.authUser._id)
    const userAddress = user.address
    return res.status(200).json({message: "All address ", data: userAddress})
} 