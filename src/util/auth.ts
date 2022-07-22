
import { NextFunction, Request, Response } from 'express'
import jwt, { Secret, JwtPayload }  from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
export const SECRET_KEY: Secret = 'JWT_Secret';

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
    if(!validatePassword) return false
    return true
    
}
