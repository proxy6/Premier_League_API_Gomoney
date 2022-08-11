import {NextFunction, Request, Response, Router} from 'express'
import UserController, { login} from '../controller/user.controller'

// import Admin from './model/admin.model'

const router = Router()
router.post('/signup', async (req: Request, res: Response, next: NextFunction)=>{
    let {name, email, password, role} = req.body
    if(Object.keys(req.body).length === 0 ){
      return res.status(400).json({message: 'Request Body is empty'})
  }
  try{
      const data = await UserController.Signup({name, email, password, role})
      res.status(201).json(data)
  }catch(e){
    console.log(e)
    res.json({error: "Error Creating User", data:e})
  }
})
router.post('/login', login)

export default router
