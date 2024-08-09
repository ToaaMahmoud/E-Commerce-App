import jwt from 'jsonwebtoken'

export const generateToken = ({payload = {}, secretKey = ''}) =>{
    return jwt.sign(payload, secretKey)
}

export const verifyToken = (token, secretKey) =>{
    return jwt.verify(token, secretKey)
}
