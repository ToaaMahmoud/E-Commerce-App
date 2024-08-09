import User from "../../../../db/models/user.model.js"
import { AppError } from "../../../utlis/appError.js"
import { comparPassword, hashPassword } from '../../../utlis/hash_and_compare.js'
import { status } from '../../../utlis/constant/user_status.js'
import { generateToken, verifyToken } from '../../../utlis/token.js'
import { sendMail } from "../../../utlis/send.mail.js"
import { Cart } from "../../../../db/indexImportFilesDB.js"

export const signUp = async(req, res, next) =>{
    // get all data.
    const {userName, passWord, email, DOB, phoneNumber, address} = req.body
    
    // check user exist or not by email or phone.
    const userExist = await User.findOne({$or:[{email}, {phoneNumber}]})
    if(userExist?.email == email) return next(new AppError("This email is already used.", 409))
    else if(userExist?.phoneNumber == phoneNumber) return next(new AppError("This phone is already used.", 409))

    // prepare Data.
    const user = new User({
        userName,
        email,
        phoneNumber,
        DOB,
        passWord,// in the 'user model' password will be hashed before user.save().
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