import fs from "fs"
import path from "path";

import multer from "multer";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";

import { AppError } from "../utlis/appError.js";

export const customValidation = {
    images: ['image/png', 'image/gif', 'image/jpeg']
}

export const createdMulter = (filePath) => {
  const destinationPath = path.resolve(`src/uploads/${filePath}`)
  if(!fs.existsSync(destinationPath)) fs.mkdirSync(destinationPath, {recursive: true})
  const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
      cb(null, destinationPath)
    },
    filename:(req, file, cb)=>{
      const uniquFileName = DateTime.now().toFormat('yyyy-mm-dd')+ "__" + nanoid(2) + "__"+ file.originalname
      cb(null, uniquFileName)
    } 
  })
  const fileFilter = (req, file, cb) =>{
    if(customValidation.images.includes(file.mimetype)) return cb(null, true)
     cb(new AppError("Invaild file type.", 400), false)  
  } 
   const uploadFile = multer({fileFilter, storage})
   return uploadFile
};