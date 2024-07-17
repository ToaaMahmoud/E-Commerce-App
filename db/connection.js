import mongoose from 'mongoose'

export const connection = () => {
    mongoose.connect(process.env.MONGODB).then(() =>{ 
        console.log("DB Connected.");
    }).catch((err) =>{
        console.log("Failed to connect to DB.");
    })
}