import User from "../../../../db/models/user.model.js"
import { AppError } from "../../../utlis/appError.js"
import { comparPassword, hashPassword } from '../../../utlis/hash_and_compare.js'
import { status } from '../../../utlis/constant/user_status.js'
import { generateToken, verifyToken } from '../../../utlis/token.js'
import { sendMail } from "../../../utlis/send.mail.js"
import { Cart } from "../../../../db/indexImportFilesDB.js"
import { generateOTP } from "../../../utlis/otp.generator.js"

export const signUp = async(req, res, next) =>{
    // get all data.
    const {userName, passWord, email, DOB, phoneNumber, address} = req.body
    
    // check user exist or not by email or phone.
    const userExist = await User.findOne({$or:[{email}, {phoneNumber}]})
    if(userExist?.email == email) return next(new AppError("This email is already used.", 409))
    else if(userExist?.phoneNumber == phoneNumber) return next(new AppError("This phone is already used.", 409))

    // hash password.
    const hashedPassword = hashPassword(passWord, 8)

    // prepare Data.
    const user = new User({
        userName,
        email,
        phoneNumber,
        DOB,
        passWord: hashedPassword,
        address
    })
    
    // Create token to verify email.
    const token = generateToken({payload: {_id: user._id}, secretKey: process.env.SECRETKEYVERIFY})
    const confirmLink = `${req.protocol}://${req.headers.host}/api/v1/auth/verify-email/${token}`

    // Verify email.
    const verify = sendMail({
        to: email,
        subject: "Welcome to E-Commerce Site.",
        html: `<a href=${confirmLink}>Please click to verify your email.</a>`
    })

    // save to db.
    const createdUser = await user.save()
    if(!createdUser) return next(new AppError("Failed to create user account.", 500))
    return res.status(201).json({message: "Signed Up successfully.", data: createdUser})
}

export const verifyEmail = async(req, res, next) =>{
    const{token} = req.params
    const decoded = verifyToken(token, process.env.SECRETKEYVERIFY)
    const userExist = await User.findByIdAndUpdate(decoded._id, {status: status.VERIFIED}, {new: true})
    if(!userExist) {return next(new AppError("User is not exist.", 404))}
    await Cart.create({user: userExist._id, products:[]})
    return res.status(200).json({message:"Email Confirmed successfully."})
}

export const login = async(req, res, next) =>{
  // get data from req.
  const { email, passWord, phoneNumber } = req.body;

  // check existence
  const userExist = await User.findOne({ $or: [{ email }, { phoneNumber }]});
  if (!userExist) return next(new AppError("User is not Found, check correctness of your email or phone number.", 404));
  
  // check if user verified or not
  if(userExist.status != status.VERIFIED) return next(new AppError("User is not Verified.So, Confirm the link sent to you.", 404));

  // check password.
  const match = comparPassword(passWord, userExist.passWord);
  if (!match) return next(new AppError("Invalid Credentials", 401));

  // update user activate
  await User.findByIdAndUpdate(userExist._id, {isActive: true})

  // create login token.
  const token = generateToken({
    payload: { _id: userExist._id },
    secretKey: process.env.SECRETKEYLOGIN,
  });
  return res
    .status(200)
    .json({ message: "Loged in Successfully.", accessToken: token });
}

export const forgetPassword = async(req, res, next) =>{
    // get data from req.
    const {email} = req.body

    // check email existence.
    const userExist = await User.findOne({email}) 
    if(!userExist) return next(new AppError("User is not exist.", 404))
    
    // check if user already has otp.
    if(userExist.otp && userExist.expireDateOtp > Date.now()){
        return next(new AppError("OTP already sent to your email.", 400))
    }
    // generate OTP.    
    const OTP = generateOTP()

    // update user OTP.
    userExist.otp = OTP
    userExist.expireDateOtp = Date.now() + 15 * 60 * 1000 // date now + 15 min
    
    // save to db.
    await userExist.save()

    // send email.
     sendMail({
        to: email,
        subject: "Forget Password of e-commerce app.",
        html: `<h1>Your otp for forgeting password is ${OTP}, 
        \n if not you ,reset your password.</h1>`
    })

    return res.status(200).json({message: "Check your email."})
}

export const changePassword = async(req, res, next) =>{
    // get data from req.
    const {otp, newPassword, email} = req.body

    // check email.
    const userExist = await User.findOne({email})
    if(!userExist) return next(new AppError("User is not found.", 404))

    // check otp.
    if(userExist.otp != otp) return next(new AppError("Invalid otp.", 401)) 

    // check otp expiration.       
    if(userExist.expireDateOtp < Date.now()){
        const OTP = generateOTP()
        userExist.otp = OTP
        userExist.expireDateOtp = Date.now() + 5 * 60 * 1000
        await userExist.save()
        sendMail({
            to: email,
            subject: "Resent otp.",
            html: `<h1>Your otp is ${OTP}</h1>`
        })
        return res.status(200).json({message: "Otp is sent again, check your email."})
    }

    // hash new password.
    const hashedPassword = hashPassword(newPassword, 8)
    userExist.passWord = hashedPassword
    userExist.otp = undefined
    userExist.expireDateOtp = undefined
    await userExist.save()

    return res.status(200).json({message: "Password changed successfully."})
}