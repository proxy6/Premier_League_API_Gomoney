import {Request, Response} from 'express'
import UserService from '../service/user.service'
import createUser from '../util/validation'
import { GenerateSignature, HashPassword, validatePassword } from '../util/auth'
import User, { IUser } from '../model/user.model'

class UserController{
  static async Signup(data:Partial<IUser>){
    let {name, email, password, role} = data
    try{ 
      const existingUser = await UserService.Login({email}) 
      if(existingUser) return Promise.reject({ status: 0, message: 'Email Exist' });
      // res.status(400).json({message: 'Email Exist'})   
      const userPassword = await HashPassword(password)
      const newUser = await UserService.SignUp({name, email, userPassword, role})
      const token = await GenerateSignature({_id: newUser._id, role: newUser.role})
      const returnedUser = {newUser, token}
      return returnedUser 
    }catch(e){
      throw new Error(e)
    }
  }

  // static async Login(userData: Partial<IUser>){
  //     let {email, password} = userData
  //     try{
  //       const user = await UserService.Login({email})
  //       if(!user) return Promise.reject({message: "User Does not Exist"})
  //       const validatePass = await validatePassword(password, user!.password)
  //       if(validatePass == true){
  //          const token = await GenerateSignature({data:{email:user!.email, _id: user!._id, role: user!.role}})
  //          user.password = ''
  //          const returnedUser = {user, token}
  //          return returnedUser 
  //       }   
  //   }catch(e){
  //       throw new Error(e)
  //   }
  // }
}
export default UserController
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
  static async findOrCreate(email, ...userData){
    const foundUser = await User.findOne({email: email})
    if(!foundUser){
      const user  = await User.create({userData})
      const token = await GenerateSignature({data:{email:user!.email, _id: user!._id, role: user!.role}})
      return user
    }
    return foundUser
  }
}





