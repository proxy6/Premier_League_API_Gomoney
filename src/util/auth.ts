
import * as jwt from 'jsonwebtoken'
import { Secret, JwtPayload }  from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
const SECRET_KEY = `${process.env.JWT_SECRET}`


export const GenerateSignature = async (payload: any) => {

    return await jwt.sign(payload, SECRET_KEY, { expiresIn: '1d'} )
}
export const HashPassword = async (password: any) => {
    const salt = bcrypt.genSaltSync(10)
    const userPassword = bcrypt.hash(password, salt)
    return userPassword
}
export const validatePassword = async (password: any, savedPassword: any)=>{
    const validatePassword = bcrypt.compareSync(password, savedPassword)
    console.log(validatePassword)
    if(!validatePassword) return false
    return true
    
}
