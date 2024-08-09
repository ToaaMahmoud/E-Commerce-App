

const validation = (schema) =>{
    return (req, res, next) =>{
        let inputData = {...req.body, ...req.params, ...req.query}
        if(req.file){
            inputData.file = {...req.file}
        }
        if(req.files){
            inputData.files = {...req.files}
        }
        const {error} = schema.validate(inputData, {abortEarly: false})
        if(error) return res.status(400).json({message: "Validation Error.", error : error.details})
        return next()    
    }
}

export default validation