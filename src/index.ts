import * as dotenv from 'dotenv'
import app from './server'
dotenv.config();
import mongooseDB from './database'
import RedisDB from './redis_db';
const port = process.env.PORT || 3000
mongooseDB().then(async ()=>{   
    await RedisDB.connect()
    RedisDB.on('connect', ()=> console.log(`Redis is connected to Port `))
    RedisDB.on('error', (error)=> console.log(console.error(error)))
    app.listen(port, ()=>{
        console.log(`Listening to port ${port}`)
    })
}).catch((e)=>{
    console.log(e)
    process.exit(1)
})

