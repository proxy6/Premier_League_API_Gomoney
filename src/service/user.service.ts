import User from "../model/user.model"

class UserService{

    async SignUp(userData: any){
        const {name, email, userPassword, role} = userData
        try{
            const user = new User({
                name,
                email,
                password:userPassword,
                role: role || 'user',
                })
            const newUser = await user.save()
            return newUser
        }catch(e){
           throw new Error('Unable to Signup User')
        }
    }
    async Login(userData: any){
         const {email} = userData
    try{
        const user = await User.findOne({email: email})
        return user
    }catch(e){
        throw new Error('Unable to Find User')
    }
    }
}
export default UserService;