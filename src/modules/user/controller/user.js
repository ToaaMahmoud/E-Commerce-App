import { User } from "../../../../db/indexImportFilesDB.js"
import { AppError } from "../../../utlis/appError.js"
import { status } from "../../../utlis/constant/user_status.js"
import { comparPassword, hashPassword } from "../../../utlis/hash_and_compare.js"
import { sendMail } from "../../../utlis/send.mail.js"
import { generateToken, verifyToken } from "../../../utlis/token.js"


export const resetPassword = async (req, res, next) => {
    // get data from req.
    const { oldPassword, newPassword } = req.body

    // check user password.
    const match = comparPassword(oldPassword, req.authUser.passWord)
    if (!match) return next(new AppError("Invalid Credentials.", 401))

    // hash new password 
    const hashedPassword = hashPassword(newPassword, 8)

    // update user password.
    await User.findByIdAndUpdate(req.authUser._id, { passWord: hashedPassword }, { new: true })

    return res.status(200).json({ message: "Password updated successfully." })
}

export const getProfile = async (req, res, next) => {
    const userData = await User.findById(req.authUser._id)
    return res.status(200).json({ message: "Your profile ", data: userData })
}

export const updateProfile = async (req, res, next) => {
    const user = await User.findById(req.authUser._id)
    if (req.body.email) {
        // check user exist or not by email.
        const userExist = await User.findOne({ email: req.body.email })
        if (userExist) return next(new AppError("This email is already used.", 409))
        
        user.email = req.body.email;    
        user.status = status.PENDING

        await user.save()
        
        // Create token to verify email.
        const token = generateToken({ payload: { _id: req.authUser._id }, secretKey: process.env.SECRETKEYUPDATEEMAIL })
        const confirmLink = `${req.protocol}://${req.headers.host}/api/v1/user/update-profile-email/verify-email/${token}`

        // Verify email.
        const verify = sendMail({
            to: req.body.email,
            subject: "Welcome to E-Commerce Site, for updating your email.",
            html: `<a href=${confirmLink}>Please click to verify your email.</a>`
        })
    }

    if (req.body.phoneNumber) {
        // check user exist or not by phone.
        const userExist = await User.findOne({ phoneNumber: req.body.phoneNumber })
        if (userExist) return next(new AppError("This phone is already used.", 409))
    }
    
    // check i user verified the email or not.
    if(user.status != status.VERIFIED) {return next(new AppError("Verify your new email.", 401))}

    // update user new data.
    const updated = await User.findByIdAndUpdate(req.authUser._id, req.body, { new: true })
    return res.status(200).json({ message: "Your updated profile ", data: updated })
}

export const verifyEmail = async(req, res, next) =>{
    const{token} = req.params
    const decoded = verifyToken(token, process.env.SECRETKEYUPDATEEMAIL)
    const userExist = await User.findByIdAndUpdate(decoded._id, {status: status.VERIFIED, isActive: false}, {new: true})
    if(!userExist) {return next(new AppError("User is not exist.", 404))}
    return res.status(200).json({message:"Email Confirmed successfully, please login with the new email."})
}
