import {Request, Response} from 'express'
import UserService from '../service/user.service'
import createUser from '../util/validation'
import { GenerateSignature, HashPassword, validatePassword } from '../util/auth'


export const signUp = async (req: Request, res: Response)=>{
        let {name, email, password, role} = req.body
        if(Object.keys(req.body).length === 0 ){
          return res.status(400).json({message: 'Request Body is empty'})
      }
        //generate hash password
        try{ 
          const existingUser = await UserService.Login({email}) 
          if(existingUser) return res.status(400).json({message: 'Email Exist'})   
          const userPassword = await HashPassword(password)
          const newUser = await UserService.SignUp({name, email, userPassword, role})
          const token = await GenerateSignature({_id: newUser._id, role: newUser.role})
          return res.status(201).json({message: "User Created", token: token, data: newUser})
        }catch(e){
          res.status(500).json({message: "Error Creating User", data:e})
        }
}
export const login = async(req: Request, res: Response)=>{
        let {email, password} = req.body
        if(Object.keys(req.body).length === 0 ){
          return res.status(400).json({message: 'Request Body is empty'})
      }
        //find user in db
        try{
          const user = await UserService.Login({email})
            if(!user) return res.status(404).json({message: "User Does not Exist"})
            const validatePass = await validatePassword(password, user!.password)
            if(validatePass == true){
               const token = await GenerateSignature({data:{email:user!.email, _id: user!._id, role: user!.role}})
               user.password = ''
               return res.status(201).json({message: "Login Successful", data: user, token})
            }
            res.status(401).json({message: "Email or Password Incorrect"})    
        }catch(e){
            res.status(500).json({data:e})
        }
}

class LoginUser{
  static async login(user) {
       const token = await GenerateSignature({data:{email:user!.email, _id: user!._id, role: user!.role}})
       return Object.assign(user, {
        token: token
       })
  }
}
export default LoginUser


