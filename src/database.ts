import {connect, ConnectOptions} from 'mongoose'
export default () => connect(process.env.DB_URL as string, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	retryWrites: false
} as ConnectOptions)
