import dotenv from 'dotenv'
import { connection } from "../db/connection.js"
import { globalErrorHandling } from "./utlis/asyncHandler.js"
import * as allRouters from './indexImportFiles.js'
import { AppError } from './utlis/appError.js'

const bootstrap = (app, express, cors) =>{
    const baseUrl = '/api/v1'
    process.on('uncaughtException', (err) => {
        console.log(err);
    })
    app.use(express.json())
    app.use(cors())
    dotenv.config()
    connection()
    app.use(`${baseUrl}/categories`,allRouters.categoryRouter)
    app.use(`${baseUrl}/sub-category`, allRouters.subCategoryRouter)
    app.use(`${baseUrl}/brands`, allRouters.brandRouter)
    app.use(`${baseUrl}/products`, allRouters.productRouter)
    app.use(`${baseUrl}/auth`, allRouters.authRouter)
    app.use(`${baseUrl}/admin`, allRouters.AdminRouter)
    app.use(`${baseUrl}/wish-list`, allRouters.wishlistRouter)
    app.use(`${baseUrl}/address`, allRouters.addressRouter)
    app.use(`${baseUrl}/review`, allRouters.reviewRouter)
    app.use(`${baseUrl}/coupon`, allRouters.couponRouter)
    app.use(`${baseUrl}/cart`, allRouters.cartRouter)
    app.use(`${baseUrl}/user`, allRouters.userRouter)
    app.use(`${baseUrl}/order`, allRouters.orderRouter)
    app.use(express.static('src/uploads'))
    app.use("*", (req, res, next) => {
            return next(new AppError("Api is not found.", 404))
          });
    process.on('unhandledRejection', (err) => {
        console.log(err);
    })
    app.use(globalErrorHandling)
}

export default bootstrap