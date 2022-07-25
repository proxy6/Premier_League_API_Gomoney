import {connect, ConnectOptions} from 'mongoose'
	 const mongooseDB = () => connect(process.env.DB_URL as string, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		retryWrites: false
	} as ConnectOptions)

export default mongooseDB



