import User from "../model/user.model"
import * as jwt from 'jsonwebtoken'
class UserService extends User{

    static async SignUp(userData: any){
        const {name, email, userPassword, role} = userData
        try{
            // const existingUser = await User.findOne({email})
            // if(existingUser) return 
            const user = new User({
                name,
                email,
                password:userPassword,
                role: role || 'user',
                })
            const newUser = await user.save()
            newUser.password = ''
            return newUser
        }catch(e){
           throw new Error('Unable to Signup User')
        }
    }
   static async Login(userData: any){
         const {email} = userData
    try{
        const user = await User.findOne({email: email})
        if(!user) return 
        return user
    }catch(e){
        throw new Error('Unable to Find User')
    }
    }
    static async FindOrCreate(email, ...Args){
        let user = await User.findOne({email})
        if(!user) return await User.create(Args)
        return user
    }
    
}
export default UserService;