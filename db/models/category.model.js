import {Schema, model, set} from 'mongoose'

const categorySchema = new Schema({
    name:{
        type: String,
        required: [true, "Name is required."],
        trim: true,
        unique: [true, "Name is unique."],
        minLength:[2, "Minimum length is 2 characters."],
        maxLength: [20, "Maximum length is 20 characters."]
    },
    slug:{
        type: String,
        required: [true, "Slug is required."],
        lowerCase: true,
        trim :true
    },
    image: {
        type: String,
        set: (value) => `http://localhost:3000/category/${value}`
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


const Category = model('Category', categorySchema)

export default Category