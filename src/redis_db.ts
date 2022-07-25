import * as redis from 'redis'
const REDIS_PORT = process.env.REDIS_PORT || 6379
const RedisDB = redis.createClient()    
export default RedisDB
