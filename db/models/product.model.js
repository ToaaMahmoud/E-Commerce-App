

import {Schema, model} from 'mongoose'

const productSchema = new Schema({
    title:{
        type: String,
        required: [true, "Title is required."],
        trim: true,
        unique: [true, "Title is unique."],
        minLength:[2, "Minimum length is 2 characters."],
        maxLength: [2000, "Maximum length is 2000 characters."]
    },
    slug:{
        type: String,
        required: [true, "Slug is required."],
        lowerCase: true,
        trim :true
    },
    mainImage: {
        type: String,
        set: (value) => `http://localhost:3000/product/${value}`
    },
    coverImage: {
        type: [String],
        set: (values) => values.map((image) => `http://localhost:3000/product/${image}`)
    },
    price:{
        type: Number,
        min: [0, 'Min price is 0'],
        required: [true, "Price is required."]
    },
    priceAfterDiscount:{
        type: Number,
        min: [0, 'Min price is 0'],
    },
    stock:{
        type: Number,
        min: [0, "Min stock is 0"],
        required: [true, "Stock is required."]
    },
    sold:{
        type: Number,
        min: [0, "Min sold is 0"],
        default: 0
    },
    rateCount:{
        type: Number,
        min: [0, "Min rateCount is 0"],
    },
    rateAvg:{
        type: Number,
        min: [0, "Min rateAvg is 0"],
    },
    category:{
        type: Schema.ObjectId,
        ref: 'Category',
        required: [true, "Category is required."]
    },
    subCategory:{
        type: Schema.ObjectId,
        ref: 'SubCategory',
        required: [true, "SubCategory is required."]
    },
    brand:{
        type: Schema.ObjectId,
        ref: 'Brand',
        required: [true, "Brand is required."]
    },
    createdBy:{
        type: Schema.ObjectId,
        required: [true, "CreatedBy is required."],
        ref: 'User'
    },
    updatedBy:{
           type: Schema.ObjectId,
           ref: 'User'
    }
}, {timestamps: true})

productSchema.methods.inStock = function(quantity){
    return (this.stock >= quantity)? true: false
}

const Product = model('Product', productSchema)

export default Product