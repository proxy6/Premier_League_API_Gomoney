import {v4 as uuidv4} from 'uuid'
import UserController from '../controller/user.controller';


export const MockUser = async () => {
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

