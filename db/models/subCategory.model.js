import {Schema, model} from 'mongoose'

const subCategorySchema = new Schema({
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
        lowerCase: true
    },
    image: String,
    // createdBy:{
        // type: Schema.ObjectId,
        // required: [true, "CreatedBy is required."],
        // ref: 'User'
    // },
    // updatedBy:{
        //    type: Schema.ObjectId,
        //    ref: 'User'
    // },
    category:{
        type: Schema.ObjectId,
        required: [true, "Category is required."],
        ref: 'Category'
    }
}, {timestamps: true})

const SubCategory = model('SubCategory', subCategorySchema)

export default SubCategory