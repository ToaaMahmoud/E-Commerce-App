
import {Schema, model} from 'mongoose'

const reviewSchema = new Schema({
    user:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    product:{
        type: Schema.ObjectId,
        ref: 'Product'
    },
    comment:{
        type: String,
        required: true
    },
    rate:{
        type: Number,
        min: 0,
        max: 5
    }
}, {timestamps: true})

const Review = model('Review', reviewSchema)

export default Review
