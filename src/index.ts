import { config } from 'dotenv'
import app from './server'
config();
import database from './database'

const port = process.env.PORT || 3000
database().then(()=>{
    app.listen(port, ()=>{
        console.log(`Listening to port ${port}`)
    })
}).catch((e)=>{
    console.log(e)
    process.exit(1)
})

