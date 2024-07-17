import express from 'express'
import cors from 'cors'
import bootstrap from './src/bootstrap.js'
import Category from './db/models/category.model.js'
import SubCategory from "./db/models/subCategory.model.js"
import Brand from "./db/models/brand.model.js"
const app = express()
const port = 3000

bootstrap(app, express, cors)
// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))