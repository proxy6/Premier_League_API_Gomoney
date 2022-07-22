import {Request, Response} from 'express'
import UserService from '../service/user.service'
import { GenerateSignature, HashPassword, validatePassword } from '../util/auth'

const service = new UserService()
export const signUp = async (req: Request, res: Response)=>{
        let {name, email, password, role} = req.body
        //generate hash password
        try{ 
          const existingUser = await service.Login({email}) 
          if(existingUser) return res.json({message: 'Email Exist'})   
          const userPassword = await HashPassword(password)
          const newUser = await service.SignUp({name, email, userPassword, role})
          const token = await GenerateSignature({_id: newUser._id, role: newUser.role})
          return res.status(201).json({message: "User Created", token: token, data: newUser})
        }catch(e){
          res.status(500).json({message: "Error Creating User", data:e})
        }
}
export const login = async(req: Request, res: Response)=>{
        let {email, password} = req.body
        //find user in db
        try{
          const user = await service.Login({email})
            if(!user) return res.status(404).json({message: "User Does not Exist"})
            const validatePass = await validatePassword(password, user!.password)
            if(validatePass == true){
               const token = await GenerateSignature({data:{email:user!.email, _id: user!._id, role: user!.role}})
               return res.status(201).json({message: "Login Successful", data: user, token})
            }
            res.status(401).json({message: "Email or Password Incorrect"})    
        }catch(e){
            res.status(500).json({data:e})
        }
}

