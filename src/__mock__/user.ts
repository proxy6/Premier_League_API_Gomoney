import User from '../model/user.model'
import UserService from '../service/user.service'
import {v4 as uuidv4} from 'uuid'
import LoginUser from '../controller/user.controller';
import UserController from '../controller/user.controller';


const CreateMockUser = async ({ name= 'Exampe Name', email= "example@gmail.com", password= 'thisisapassword'}= {}) => {
	email = email || `new${uuidv4()}@gmail.com`;
	await User.create({
		email,
		password,
		name
	});
	const user = await UserService.Login({email});
	return  UserController.Login(user)
};

export default CreateMockUser