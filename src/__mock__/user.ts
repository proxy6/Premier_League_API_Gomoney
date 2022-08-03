import User from '../model/user.model'
import UserService from '../service/user.service'
import {v4 as uuidv4} from 'uuid'
import LoginUser from '../controller/user.controller';
import UserController from '../controller/user.controller';


export const MockUser = async ({ name= 'Exampe Name', email= "example@gmail.com", password= 'thisisapassword'}= {}) => {
	let UserArgs = {
		name: 'Sentry Suit',
		email: `${uuidv4()}@gmail.com`,
		password: 'examplepassword',
		role: "user"
		};
	const user = await UserController.Signup(UserArgs)
	return  user
};

export const AdminMockUser = async ({ name= 'Exampe Name', email= "example@gmail.com", password= 'thisisapassword'}= {}) => {
	let UserArgs = {
		name: 'Sentry Suit',
		email: `${uuidv4()}@gmail.com`,
		password: 'examplepassword',
		role: "admin"
		};
	const user = await UserController.Signup(UserArgs)
	return  user
};

export default AdminMockUser