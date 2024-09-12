import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middlewares/authenticate_authorizate.js";
import { asyncHandler } from "../../utlis/asyncHandler.js";
import { role } from "../../utlis/constant/user_role.js";
import * as adminController from './controller/admin.js'

const AdminRouter = Router()
AdminRouter
.post('/add-user', isAuthenticate(), isAuthorized([role.ADMIN]), asyncHandler(adminController.addUser))
.delete('/remove-user/:userId', isAuthenticate(), isAuthorized([role.ADMIN]), asyncHandler(adminController.deleteUser))
export default AdminRouter