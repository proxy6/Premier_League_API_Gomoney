import * as redis from 'redis'
const RedisDB = redis.createClient({url: process.env.REDIS_URL})    
export default RedisDB
