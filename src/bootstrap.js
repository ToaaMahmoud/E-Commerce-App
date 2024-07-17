import dotenv from 'dotenv'
import { connection } from "../db/connection.js"
import { globalErrorHandling } from "./utlis/asyncHandler.js"
import categoryRouter from './modules/category/category.router.js'
import subCategoryRouter  from './modules/subCategory/subCategory.router.js'
import brandRouter from './modules/brand/brand.router.js'
// import * as routers from './modules/importRouterFiles.js'
const bootstrap = (app, express, cors) =>{
    const baseUrl = '/api/v1'
    process.on('uncaughtException', (err) => {
        console.log(err);
    })
    app.use(express.json())
    app.use(cors())
    dotenv.config()
    connection()
    app.use(`${baseUrl}/categories`,categoryRouter)
    app.use(`${baseUrl}/sub-category`, subCategoryRouter)
    app.use(`${baseUrl}/brands`, brandRouter)
    app.use("*", (req, res) => {
            return next(new AppError("Api is not found.", 404))
          });
    process.on('unhandledRejection', (err) => {
        console.log(err);
    })
    app.use(globalErrorHandling)
}

export default bootstrap